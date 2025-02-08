export const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Allow only your frontend
  credentials: true, // Allow cookies & authentication
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type",
};
