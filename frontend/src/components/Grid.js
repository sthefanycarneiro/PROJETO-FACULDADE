import React, { useContext, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import DonorModal from "./DonorModal";

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 10px;
  max-width: 1120px;
  margin: 20px auto;
  word-break: break-all;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const Th = styled.th`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;

  svg {
    cursor: pointer;
  }

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

export const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};

  svg {
    cursor: pointer;
  }

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

const InputFilter = styled.input`
  width: 80%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Grid = ({ users, setUsers, setOnEdit }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState({
    nome: "",
    email: "",
    fone: "",
    item: "",
  });

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await axios
          .delete(`http://localhost:8800/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(({ data }) => {
            const newArray = users.filter((user) => user.id !== id);
            setUsers(newArray);
            toast.success(data);
          })
          .catch(({ data }) => toast.error(data));
        setOnEdit(null);
      } catch (error) {
        toast.error("Erro ao deletar o usuário.");
      }
    }
  };

  const totalDonors = users.filter(
    (user) => user.item && user.item.trim() !== ""
  ).length;

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    const filteredUsers = await fetchFilteredUsers(newFilters);
    setUsers(filteredUsers);
  };


  const fetchFilteredUsers = async (filters) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`http://localhost:8800/api/users?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários filtrados:", error);
      return [];
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.nome.toLowerCase().includes(filters.nome.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.fone.toLowerCase().includes(filters.fone.toLowerCase()) &&
      user.item?.toLowerCase().includes(filters.item.toLowerCase())
    );
  });

  return (
    <>
      <DonorModal totalDonors={totalDonors} />
      <Table>
        <Thead>
          <Tr>
            <Th>
              Responsável
              <InputFilter
                type="text"
                placeholder="Filtrar..."
                name="nome"
                value={filters.nome}
                onChange={handleFilterChange}
              />
            </Th>
            <Th>
              Email
              <InputFilter
                type="text"
                placeholder="Filtrar..."
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
              />
            </Th>
            <Th onlyWeb>
              Fone
              <InputFilter
                type="text"
                placeholder="Filtrar..."
                name="fone"
                value={filters.fone}
                onChange={handleFilterChange}
              />
            </Th>
            <Th>
              Item de Doação
              <InputFilter
                type="text"
                placeholder="Filtrar..."
                name="item"
                value={filters.item}
                onChange={handleFilterChange}
              />
            </Th>
            <Th>Editar</Th>
            <Th>Excluir</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((item, i) => (
            <Tr key={i}>
              <Td width="20%">{item.nome}</Td>
              <Td width="20%">{item.email}</Td>
              <Td width="20%" onlyWeb>
                {item.fone}
              </Td>
              <Td width="20%">{item.item || "Não especificado"}</Td> {/* Tratamento do item opcional */}
              <Td alignCenter width="8%">
                <FaEdit onClick={() => handleEdit(item)} />
              </Td>
              <Td alignCenter width="8%">
                <FaTrash onClick={() => handleDelete(item.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  )};

export default Grid;
