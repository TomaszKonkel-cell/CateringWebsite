import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Form,
  Button,
  Col,
  Container,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";

import { TbPassword } from "react-icons/tb";

import Swal from "sweetalert2";
import ClientService from "../../service/ClientService";

const VerifyReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [validated, setValidated] = useState(false);

  let navigate = useNavigate();
  const location = useLocation();
  const clientId = new URLSearchParams(location.search).get("clientId");
  console.log(clientId);
  const handleChange = (e) => {
    setNewPassword(e.target.value);
    console.log(newPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (newPassword.length == 0) {
      Swal.fire({
        text: "Podaj nowe hasło",
        icon: "warning",
      });
    } else {
      ClientService.verifyReset(clientId, newPassword).then(
        () => {
          Swal.fire({
            text: "Hasło zmienione pomyślnie!",
            icon: "success",
          });
          navigate("/login");
        },
        (error) => {
          if (error.response.status == 401) {
            Swal.fire({
              text: error.response.data.message,
              icon: "error",
            });
          } else {
            if (typeof error.response.data == "string") {
              Swal.fire({
                text: "Nie można wykonać operacji zmiany hasła",
                icon: "error",
              });
            }
          }
        }
      );
      setValidated(true);
    }
  };

  return (
    <Container
      style={{ backgroundColor: "lightgray" }}
      className="p-3 my-5 d-flex flex-column w-25 border border-1 rounded-3 shadow-lg"
    >
      {clientId ? (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="text-center">
            <p className="font-weight-bold">Podaj nowe hasło</p>
          </div>
          <Row>
            <Col col="6">
              <InputGroup className="p-2">
                <InputGroup.Text>
                  <TbPassword />
                </InputGroup.Text>
                <Form.Control
                  required
                  name="newPasswod"
                  type="password"
                  placeholder="Podaj nowe hasło"
                  className="rounded-end"
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Pole musi być uzupełnione
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Row>

          <Button type="submit" variant="primary" className="w-100 mt-4">
            Zmień
          </Button>
        </Form>
      ) : (
        <div className="text-center">
          <p className="font-weight-bold">Funkcja niedostępna</p>
        </div>
      )}
    </Container>
  );
};

export default VerifyReset;
