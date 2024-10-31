
import React, { useContext } from "react";
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

  svg {cursor: pointer;}

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

export const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};

  svg {cursor: pointer;}

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

const Grid = ({ users, setUsers, setOnEdit }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await axios.delete(`http://localhost:8800/api/users/${id}`, {
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

  const totalDonors = users.filter((user) => user.item && user.item.trim() !== "").length;

  return (
    <>
    <DonorModal totalDonors={totalDonors} />
    <Table>
      <Thead>
        <Tr>
          <Th>Responsável</Th>
          <Th>Email</Th>
          <Th onlyWeb>Fone</Th>
          <Th>Item de Doação</Th>
          <Th>Editar</Th>
          <Th>Excluir</Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((item, i) => (
          <Tr key={i}>
            <Td width="20%">{item.nome}</Td>
            <Td width="20%">{item.email}</Td>
            <Td width="20%" onlyWeb>
              {item.fone}
            </Td>
            <Td width="20%">{item.item}</Td>
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
  );
};

export default Grid;
