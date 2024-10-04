// api/index.js
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";

const app = express();

// Permitir o CORS para o frontend
app.use(cors({
  origin: "http://localhost:3000", // Ajuste conforme necessário
  credentials: true, 
}));
app.use(express.json());

app.use("/api", userRoutes);

app.listen(8800, () => {
  console.log("Servidor rodando na porta 8800");
});
