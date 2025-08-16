export const corsOptions = {
  origin: ["http://localhost:5173", process.env.CORS_ORIGIN, process.env.CORS_DEV],
  credentials: true, // Allow cookies & authentication
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type",
};
