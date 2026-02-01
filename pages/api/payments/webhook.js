import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Verify webhook signature (basic IP whitelist for Yookassa)
const YOOKASSA_IPS = [
  "185.71.76.0/27",
  "185.71.77.0/27",
  "77.75.153.0/25",
  "77.75.156.11",
  "77.75.156.35",
  "77.75.154.128/25",
  "2a02:5180::/32",
];

function isValidYookassaIP(ip) {
  // In production, implement proper IP range checking
  // For development, we'll accept all IPs
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  // Basic check - in production, use a proper CIDR library
  return YOOKASSA_IPS.some((range) => ip.startsWith(range.split("/")[0].slice(0, -3)));
}

// Map package types to credits
const PACKAGE_CREDITS = {
  singleGeneration: 1,
  pack5: 5,
  pack10: 10,
  unlimited: -1, // -1 means unlimited
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify source IP
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  if (!isValidYookassaIP(clientIp)) {
    console.warn(`[Webhook] Rejected request from IP: ${clientIp}`);
    // Still return 200 to not reveal validation logic
    return res.status(200).json({ received: true });
  }

  const { event, object } = req.body;

  console.log(`[Webhook] Received event: ${event}`, {
    paymentId: object?.id,
    status: object?.status,
  });

  // Handle payment succeeded event
  if (event === "payment.succeeded" && object) {
    try {
      const { id: paymentId, metadata, amount } = object;
      const { userId, packageType, generationId } = metadata || {};

      if (!userId) {
        console.error("[Webhook] Missing userId in metadata");
        return res.status(200).json({ received: true });
      }

      // Record payment
      await supabaseAdmin.from("payments").insert({
        id: paymentId,
        user_id: userId,
        amount: parseFloat(amount.value),
        currency: amount.currency,
        status: "succeeded",
        package_type: packageType,
        generation_id: generationId,
        metadata,
        created_at: new Date().toISOString(),
      });

      // Update user credits
      const credits = PACKAGE_CREDITS[packageType] || 0;
      
      if (credits === -1) {
        // Unlimited plan - set expiration date
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_type: "unlimited",
            subscription_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      } else if (credits > 0) {
        // Add credits to user
        await supabaseAdmin.rpc("add_credits", {
          user_id: userId,
          amount: credits,
        });
      }

      console.log(`[Webhook] Payment processed: ${paymentId}, credits: ${credits}`);
    } catch (error) {
      console.error("[Webhook] Error processing payment:", error);
      // Still return 200 to prevent retries for failed processing
    }
  }

  // Handle payment cancelled
  if (event === "payment.canceled" && object) {
    try {
      const { id: paymentId, metadata } = object;

      await supabaseAdmin.from("payments").upsert({
        id: paymentId,
        status: "canceled",
        metadata,
        updated_at: new Date().toISOString(),
      });

      console.log(`[Webhook] Payment canceled: ${paymentId}`);
    } catch (error) {
      console.error("[Webhook] Error processing cancellation:", error);
    }
  }

  // Handle refund
  if (event === "refund.succeeded" && object) {
    try {
      const { payment_id: paymentId, amount } = object;

      await supabaseAdmin
        .from("payments")
        .update({
          status: "refunded",
          refunded_amount: parseFloat(amount.value),
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentId);

      console.log(`[Webhook] Refund processed for payment: ${paymentId}`);
    } catch (error) {
      console.error("[Webhook] Error processing refund:", error);
    }
  }

  // Always return 200 to acknowledge receipt
  return res.status(200).json({ received: true });
}

export const config = {
  api: {
    bodyParser: true,
  },
};
