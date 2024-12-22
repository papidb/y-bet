import cors from "@elysiajs/cors";

export default cors({
  origin: process.env.ALLOWED_ORIGIN,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
});
