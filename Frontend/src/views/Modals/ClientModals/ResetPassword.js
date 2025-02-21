import React, { useEffect, useState } from "react";

import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

import { MdOutlineAlternateEmail } from "react-icons/md";
import Swal from "sweetalert2";
import ClientService from "../../../service/ClientService";

const ResetPassword = (props) => {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClose = () => window.location.reload();
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    Swal.fire("Wysyłanie...");
    Swal.showLoading();

    if (email.length == 0) {
      Swal.fire({
        text: "Podaj adres email",
        icon: "warning",
      });
    } else {
      ClientService.resetPassword(email).then(
        () => {
          setSuccess(true);
          Swal.close();
        },
        (error) => {
          if (error.response.status == 401) {
            Swal.close();
            setMessage(error.response.data.message);
          } else {
            if (typeof error.response.data == "string") {
              Swal.close();
              setMessage(error.response.data);
            }
            if (typeof error.response.data == "object") {
              Swal.close();
              console.log(error.response.data.errors);
            }
          }
        }
      );
      setValidated(true);
    }
  };

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Resetowanie hasła</Modal.Title>
      </Modal.Header>
      {success ? (
        <div>
          <Modal.Body>
            <div className="alert alert-success" role="alert">
              Link do resetowania hasła został wysłany na adres email: {email}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Powrót
            </Button>
          </Modal.Footer>
        </div>
      ) : (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="text-center">
              <p className="font-weight-bold">Podaj adres email</p>
            </div>
            <Row>
              <Col col="6">
                <InputGroup className="p-2">
                  <InputGroup.Text>
                    <MdOutlineAlternateEmail />
                  </InputGroup.Text>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Podaj adres email"
                    className="rounded-end"
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Pole musi być uzupełnione
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
            <div className="mt-2"></div>
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Anuluj
            </Button>
            <Button type="submit" variant="primary">
              Zapisz
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
};

export default ResetPassword;
