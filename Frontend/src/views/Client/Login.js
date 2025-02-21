import React, { useEffect, useState } from "react";

import {
  Button,
  Container,
  Form,
  Tooltip,
  OverlayTrigger,
  InputGroup,
} from "react-bootstrap";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import ClientService from "../../service/ClientService";
import ResetPassword from "../Modals/ClientModals/ResetPassword";

const Login = () => {
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState({});
  const [modalResetPassword, setModalResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    Swal.fire("Logowanie...");
    Swal.showLoading();
    const postData = new FormData();
    postData.append("email", formData.email);
    postData.append("password", formData.password);

    ClientService.login(postData).then(
      () => {
        Swal.close();
        navigate("/account");
        window.location.reload();
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
            setMessageList(error.response.data);
          }
        }
      }
    );

    setValidated(true);
  };

  useEffect(() => {
    const logged = ClientService.getCurrentClient();
    if (logged) {
      navigate("/account");
    }
  }, []);
  
  const tooltip = (text) => (
    <Tooltip id="tooltip">
      <strong>{text}</strong>
    </Tooltip>
  );

  return (
    <Container
      style={{ backgroundColor: "lightgray" }}
      className="p-3 my-5 d-flex flex-column w-50 border border-1 rounded-3 shadow-lg"
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="text-center">
          <p className="font-weight-bold">Zaloguj sie, jeśli posiadasz konto</p>
        </div>
        <InputGroup className="p-2">
          <InputGroup.Text>
            <MdOutlineAlternateEmail />
          </InputGroup.Text>
          <Form.Control
            name="email"
            required
            type="email"
            placeholder="name@example.com"
            className=" rounded-end"
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Adres mail jest wymagany
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="p-2">
          <InputGroup.Text>
            <TbPassword />
          </InputGroup.Text>
          <Form.Control
            name="password"
            required
            type="password"
            placeholder="Hasło...."
            className="rounded-end"
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Hasło jest wymagane
          </Form.Control.Feedback>
        </InputGroup>

        <div className="d-flex justify-content-end my-3 mb-4">
          <a onClick={() => setModalResetPassword(true)}>Zapomniałeś hasło?</a>
        </div>

        <OverlayTrigger placement="top" overlay={tooltip("Przycisk logowania")}>
          <Button
            type="submit"
            className="w-100 mb-4 font-weight-bold"
            size="md"
          >
            Zaloguj
          </Button>
        </OverlayTrigger>
      </Form>
      <div className="text-center">
        <p>
          Nie posiadasz konta? <a href="/register">Rejestracja</a>
        </p>
      </div>

      {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )}

      <ResetPassword show={modalResetPassword} />
    </Container>
  );
};

export default Login;
