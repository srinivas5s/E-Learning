import express from "express";
import cors from "cors";

import router from "./src/routes/index.js"; // or router.js
import errorHandler from "./src/middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("Hello");
});

// All API Routes
app.use("/api/v1", router);

// Error Handler (should be last)
app.use(errorHandler);

export default app;