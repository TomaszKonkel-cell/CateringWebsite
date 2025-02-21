import React, { useEffect, useState } from "react";

import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

import { TbPassword } from "react-icons/tb";
import Swal from "sweetalert2";
import ClientService from "../../../service/ClientService";

const ConfirmPass = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClose = () => window.location.reload();
  const handleChange = (e) => {
    setConfirmPass(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (confirmPass.length == 0) {
      Swal.fire({
        text: "Podaj swoje obecne hasło w celu weryfikacji",
        icon: "warning",
      });
    } else {
      ClientService.updateClientPass(
        props.account,
        props.newPassword,
        confirmPass
      ).then(
        () => {
          setSuccess(true);
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

  useEffect(() => {
    setPassword(props.newPassword);
  });

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Szczegóły adresu</Modal.Title>
      </Modal.Header>
      {success ? (
        <div>
          <Modal.Body>
            <div className="alert alert-success" role="alert">
              Hasło pomyślnie zmienione
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
              <p className="font-weight-bold">Potwierdź zmiane starym hasłem</p>
            </div>
            <Row>
              <Col col="6">
                <InputGroup className="p-2">
                  <InputGroup.Text>
                    <TbPassword />
                  </InputGroup.Text>
                  <Form.Control
                    name="confrimPass"
                    type="password"
                    placeholder="Podaj stare hasło"
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

export default ConfirmPass;
