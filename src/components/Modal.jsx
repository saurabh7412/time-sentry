// src/components/Modal.js

import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #4183d7;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #3678c0;
  }
`;

const Modal = ({ message, onClose }) => (
  <ModalOverlay>
    <ModalContent>
      <h2>Congratulations!</h2>
      <p>{message}</p>
      <Button onClick={onClose}>Close</Button>
    </ModalContent>
  </ModalOverlay>
);

export default Modal;
