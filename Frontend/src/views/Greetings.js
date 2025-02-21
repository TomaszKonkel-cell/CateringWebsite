import React from "react";

import { Button, Container } from "react-bootstrap";
import { BsPersonDown } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Greetings = () => {
  let navigate = useNavigate();
  return (
    <Container
      style={{ backgroundColor: "lightgray" }}
      className="p-3 my-5 d-flex flex-column w-50 rounded-3 shadow-lg"
    >
      <div className="text-center">
        <p style={{ fontSize: 24, fontWeight: "bold" }}>
          Witaj w CateringApp!!!
        </p>
      </div>

      <BsPersonDown size={65} className="w-100 mb-4" />

      <Button
        className="mb-4 font-weight-bold"
        variant="outline-primary"
        onClick={() => navigate("/login")}
      >
        Zaloguj
      </Button>
      <Button
        className="mb-4 font-weight-bold"
        onClick={() => navigate("/register")}
      >
        Rejestracja
      </Button>
    </Container>
  );
};

export default Greetings;
