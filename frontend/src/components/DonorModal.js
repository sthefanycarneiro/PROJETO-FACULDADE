import React from "react";
import styled from "styled-components";

const ModalContainer = styled.div`
  position: fixed;
  top: 100px;
  left: 70px; 
  width: 250px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  margin: 0;
  padding-bottom: 10px; 
  font-size: 1.2em;
  color: #333;
`;

const DonorCount = styled.p`
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
  color: #555;
`;

const DonorModal = ({ totalDonors }) => (
  <ModalContainer>
    <Title>Total de Doadores</Title>
    <DonorCount>{totalDonors}</DonorCount>
  </ModalContainer>
);

export default DonorModal;
