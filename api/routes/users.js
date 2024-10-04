// api/routes/users.js
import express from "express";
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
  register,
  login,
} from "../controllers/user.js";

const router = express.Router();

// Rotas de autenticação
router.post("/register", register);
router.post("/login", login);

// Rotas protegidas
router.get("/users", getUsers);
router.post("/users", addUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
