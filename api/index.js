
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
}));
app.use(express.json());

app.use("/api", userRoutes);

app.listen(8800, () => {
  console.log("Servidor rodando na porta 8800");
});
