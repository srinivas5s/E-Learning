import express from "express";
import cors from "cors";
import errorHandler from "./src/middlewares/error.middleware.js";
import authRoutes from "./src/routes/auth.routes.js"
import courseRoutes from "./src/routes/course.routes.js"

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // if using cookies / auth
  })
);

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);

app.get("/", (req, res) => {
  res.send("Hello")
})

app.use(errorHandler);

export default app;

