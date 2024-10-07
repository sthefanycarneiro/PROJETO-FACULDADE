
import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  justify-content: center; /* Centraliza os itens horizontalmente */
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza os itens dentro do InputArea */
  text-align: center; /* Centraliza o texto do Label */
  margin-bottom: 10px; /* Adiciona um espaço entre os campos */
`;

const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
  margin: 0 auto; /* Centraliza horizontalmente dentro do InputArea */
`;

const InputItem = styled.input`
  width: 500px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
  margin: 0 auto; /* Centraliza horizontalmente dentro do InputArea */
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
  margin-top: 10px; /* Adiciona um espaço acima do botão */
  align-self: center; /* Centraliza o botão dentro do FormContainer */
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();
  
  // Definindo o token a partir do localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      user.nome.value = onEdit.nome;
      user.email.value = onEdit.email;
      user.fone.value = onEdit.fone;
      user.data_nascimento.value = onEdit.data_nascimento;
      user.item.value = onEdit.item;
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userForm = ref.current;

    if (
      !userForm.nome.value ||
      !userForm.email.value ||
      !userForm.fone.value ||
      !userForm.data_nascimento.value ||
      !userForm.item.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    try {
      if (onEdit) {
        await axios.put(`http://localhost:8800/api/users/${onEdit.id}`, {
          nome: userForm.nome.value,
          email: userForm.email.value,
          fone: userForm.fone.value,
          data_nascimento: userForm.data_nascimento.value,
          item: userForm.item.value,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(({ data }) => toast.success(data.message))
        .catch(({ response }) => toast.error(response?.data?.message || "Erro ao atualizar usuário"));
      } else {
        await axios.post("http://localhost:8800/api/users", {
          nome: userForm.nome.value,
          email: userForm.email.value,
          fone: userForm.fone.value,
          data_nascimento: userForm.data_nascimento.value,
          item: userForm.item.value,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(({ data }) => toast.success(data.message))
        .catch(({ response }) => toast.error(response?.data?.message || "Erro ao criar usuário"));
      }

      // Limpar os campos do formulário
      userForm.nome.value = "";
      userForm.email.value = "";
      userForm.fone.value = "";
      userForm.data_nascimento.value = "";
      userForm.item.value = "";

      setOnEdit(null);
      getUsers();
    } catch (error) {
      toast.error("Erro ao processar a requisição.");
    }
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Responsável</Label>
        <Input name="nome" />
      </InputArea>
      <InputArea>
        <Label>E-mail</Label>
        <Input name="email" type="email" />
      </InputArea>
      <InputArea>
        <Label>Telefone</Label>
        <Input name="fone" />
      </InputArea>
      <InputArea>
        <Label>Data de Nascimento</Label>
        <Input name="data_nascimento" type="date" />
      </InputArea>
      <InputArea>
        <Label>Item de doação</Label>
        <InputItem name="item"/>
      </InputArea>
      <Button type="submit">SALVAR</Button>
    </FormContainer>
  );
};

export default Form;
