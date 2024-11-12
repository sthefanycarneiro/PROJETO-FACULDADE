
import { db } from "../db.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

const JWT_SECRET = "sua_chave_secreta";

export const getUsers = (req, res) => {
  let q = "SELECT id, nome, email, fone, data_nascimento, item FROM usuarios WHERE 1=1";
  
  const { nome, email, fone, item } = req.query;

  if (nome) q += ` AND nome LIKE '${nome}%'`; 
  if (email) q += ` AND email LIKE '${email}%'`;
  if (fone) q += ` AND fone LIKE '${fone}%'`;
  if (item) q += ` AND item LIKE '${item}%'`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addUser = async (req, res) => {
  const q =
    "INSERT INTO usuarios(`nome`, `email`, `fone`, `data_nascimento`, `item`, `password`) VALUES(?)";

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const values = [
      req.body.nome,
      req.body.email,
      req.body.fone,
      req.body.data_nascimento,
      req.body.item || null,
      hashedPassword,
    ];

    db.query(q, [values], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email já cadastrado." });
        }
        return res.status(500).json(err);
      }

      return res.status(201).json({ message: "Usuário criado com sucesso." });
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar usuário." });
  }
};

export const updateUser = async (req, res) => {
  const { nome, email, fone, data_nascimento, item, password } = req.body;

  let hashedPassword = null;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  let q = "UPDATE usuarios SET `nome` = ?, `email` = ?, `fone` = ?, `data_nascimento` = ?, `item` = ?";
  const values = [nome, email, fone, data_nascimento, item];

  if (hashedPassword) {
    q += ", `password` = ?";
    values.push(hashedPassword);
  }

  q += " WHERE `id` = ?";
  values.push(req.params.id);

  db.query(q, values, (err) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json("Usuário atualizado com sucesso.");
  });
};

export const deleteUser = (req, res) => {
  const q = "DELETE FROM usuarios WHERE `id` = ?";

  db.query(q, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json("Usuário deletado com sucesso.");
  });
};

// Registro de Usuário
export const register = async (req, res) => {
  const q = "SELECT * FROM usuarios WHERE email = ?";

  db.query(q, [req.body.email], async (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(400).json({ message: "Email já cadastrado." });

    try {
      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const item = req.body.item || "default"; 

      const insertQuery =
        "INSERT INTO usuarios(`nome`, `email`, `fone`, `data_nascimento`, `item`, `password`) VALUES(?)";

      const values = [
        req.body.nome,
        req.body.email,
        req.body.fone,
        req.body.data_nascimento,
        item,  
        hashedPassword,
      ];

      db.query(insertQuery, [values], (err) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ message: "Usuário registrado com sucesso." });
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao registrar usuário." });
    }
  });
};

// Login de Usuário
export const login = (req, res) => {
  const q = "SELECT * FROM usuarios WHERE email = ?";

  db.query(q, [req.body.email], async (err, data) => {
    if (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      return res.status(500).json(err);
    }

    if (data.length === 0) {
      console.log("Usuário não encontrado para o email:", req.body.email);
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const user = data[0];

    // Verifica a senha
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      console.log("Senha incorreta para o usuário:", user.email);
      return res.status(400).json({ message: "Senha incorreta." });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    const { password, ...other } = user;

    res.cookie("access_token", token, {
      httpOnly: true,

    })
    .status(200)
    .json(other);
  });
};