import express from "express";
import errorHandler from "./src/middlewares/error.middleware.js";
import authRoutes from "./src/routes/auth.routes.js"

const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRoutes);

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler); 

export default app;

