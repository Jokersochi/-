import axios from "axios";
import { PAYMENT_AMOUNTS } from "../../../utils/constants";

const YOOKASSA_API_URL = "https://api.yookassa.ru/v3/payments";
const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;

// Validate payment request
function validatePaymentRequest(body) {
  const errors = [];

  if (!body.amount || typeof body.amount !== "number" || body.amount <= 0) {
    errors.push("amount must be a positive number");
  }

  if (!body.description || typeof body.description !== "string") {
    errors.push("description is required");
  }

  return errors;
}

// Generate unique idempotency key
function generateIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET - Check payment status
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    try {
      const response = await axios.get(`${YOOKASSA_API_URL}/${id}`, {
        auth: {
          username: YOOKASSA_SHOP_ID,
          password: YOOKASSA_SECRET_KEY,
        },
      });

      return res.status(200).json({
        id: response.data.id,
        status: response.data.status,
        paid: response.data.paid,
        amount: response.data.amount,
        metadata: response.data.metadata,
      });
    } catch (error) {
      console.error("[Payment Status] Error:", error.response?.data || error.message);
      return res.status(500).json({
        error: "Не удалось получить статус платежа",
      });
    }
  }

  // POST - Create payment
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      allowedMethods: ["GET", "POST"],
    });
  }

  // Check configuration
  if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY) {
    console.error("[Payment] Missing Yookassa credentials");
    return res.status(500).json({
      error: "Платежная система не настроена",
    });
  }

  // Validate request
  const validationErrors = validatePaymentRequest(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: validationErrors,
    });
  }

  const { amount, description, metadata = {} } = req.body;

  // Build return URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${req.headers.host}`;
  const returnUrl = `${baseUrl}/payment/success`;

  try {
    const paymentData = {
      amount: {
        value: amount.toFixed(2),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: returnUrl,
      },
      description: description.substring(0, 128), // Yookassa limit
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
      },
    };

    console.log("[Payment] Creating payment:", paymentData);

    const response = await axios.post(YOOKASSA_API_URL, paymentData, {
      auth: {
        username: YOOKASSA_SHOP_ID,
        password: YOOKASSA_SECRET_KEY,
      },
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": generateIdempotencyKey(),
      },
    });

    console.log("[Payment] Created successfully:", response.data.id);

    return res.status(200).json({
      success: true,
      paymentId: response.data.id,
      paymentUrl: response.data.confirmation?.confirmation_url,
      status: response.data.status,
    });
  } catch (error) {
    console.error("[Payment] Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res.status(500).json({
        error: "Ошибка авторизации платежной системы",
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        error: "Неверные параметры платежа",
        details: error.response.data?.description,
      });
    }

    return res.status(500).json({
      error: "Не удалось создать платеж. Попробуйте позже.",
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
