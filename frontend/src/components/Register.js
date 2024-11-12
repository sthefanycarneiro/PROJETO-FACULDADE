import React, { useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
`;

const PageBackground = styled.div`
  width: 100%;
  height: 100vh; /* Preenche toda a altura da tela */
  background-color: #add8e6; /* Azul claro */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  width: 95%;
  padding: 10px;
  background-color: #2c73d2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 10px;
`;

const Register = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [fone, setFone] = useState("");
  const [data_nascimento, setDataNascimento] = useState("");
  const [password, setPassword] = useState("");
  const [item, setItem] = useState(""); 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !email || !fone || !data_nascimento || !password) {
      return toast.warn("Por favor, preencha todos os campos.");
    }

    try {
      const res = await axios.post("http://localhost:8800/api/register", {
        nome,
        email,
        fone,
        data_nascimento,
        item, 
        password,
      });

      toast.success("Cadastro realizado com sucesso! Faça login.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao realizar o cadastro."
      );
    }
  };

  return (
    <PageBackground>
      <RegisterContainer>
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Telefone"
            value={fone}
            onChange={(e) => setFone(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Data de Nascimento"
            value={data_nascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Item de Doação (opcional)"
            value={item}
            onChange={(e) => setItem(e.target.value)} 
          />
          <Button type="submit">Cadastrar</Button>
        </form>
        <LoginLink>
          Já possui uma conta? <Link to="/login">Faça Login</Link>
        </LoginLink>
      </RegisterContainer>
    </PageBackground>
  );
};

export default Register;
