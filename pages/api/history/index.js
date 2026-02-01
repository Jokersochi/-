import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Parse authorization header
function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

// Verify user from token
async function verifyUser(req) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("[Auth] Error verifying user:", error);
    return null;
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Verify authentication
  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Требуется авторизация",
    });
  }

  // GET - Fetch history
  if (req.method === "GET") {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = parseInt(req.query.offset) || 0;

      const { data, error, count } = await supabase
        .from("generations")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: offset + limit < count,
        },
      });
    } catch (error) {
      console.error("[History] Error fetching:", error);
      return res.status(500).json({
        error: "Не удалось загрузить историю",
      });
    }
  }

  // DELETE - Delete history item
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: "ID is required",
      });
    }

    try {
      const { error } = await supabase
        .from("generations")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: "Запись удалена",
      });
    } catch (error) {
      console.error("[History] Error deleting:", error);
      return res.status(500).json({
        error: "Не удалось удалить запись",
      });
    }
  }

  return res.status(405).json({
    error: "Method not allowed",
    allowedMethods: ["GET", "DELETE"],
  });
}

export const config = {
  api: {
    bodyParser: true,
  },
};
