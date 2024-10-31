
import React, { useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const LoginContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 100px auto;
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
  width: 96%;
  padding: 10px;
  background-color: #2c73d2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 10px;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.warn("Por favor, preencha todos os campos.");
    }

    try {
      const res = await axios.post("http://localhost:8800/api/login", {
        email,
        password,
      });

      const token = res.data.token || res.data.access_token; 
      login(res.data, token);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      window.alert("Login falhou! Caso não tenha uma conta, cadastre-se.");
      toast.error(
        error.response?.data?.message || "Erro ao realizar o login."
      );
    }
  };

  return (
    <PageBackground>
    <LoginContainer>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Entrar</Button>
      </form>
      <RegisterLink>
        Não possui uma conta? <Link to="/register">Cadastre-se</Link>
      </RegisterLink>
    </LoginContainer>
    </PageBackground>
  );
};

export default Login;
