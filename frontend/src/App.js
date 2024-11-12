import GlobalStyle from "./styles/global";
import styled from "styled-components";
import Form from "./components/Form.js";
import Grid from "./components/Grid";
import { useEffect, useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthContext } from "./contexts/AuthContext";

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

const Main = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8800/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar os usuários:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container>
      <Title>Gestão de Doações</Title>
      <button onClick={logout}>Logout</button>
      <Form getUsers={getUsers} onEdit={onEdit} setOnEdit={setOnEdit} />
      <Grid users={users} setUsers={setUsers} setOnEdit={setOnEdit} />
      <ToastContainer autoClose={3000} position="bottom-left" />
      <GlobalStyle />
    </Container>
  );
};

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Main /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
