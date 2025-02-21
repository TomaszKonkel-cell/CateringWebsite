import React, { useEffect, useState } from "react";

import {
  Button,
  Container,
  Tooltip,
  OverlayTrigger,
  Col,
  Row,
  Form,
  InputGroup,
} from "react-bootstrap";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { CiUser } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { IoMdPhonePortrait } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import ClientService from "../../service/ClientService";

const Register = () => {
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    password: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    Swal.fire("Zapisywanie...");
    Swal.showLoading();
    
    const postData = new FormData();
    postData.append("name", formData.name);
    postData.append("lastname", formData.lastname);
    postData.append("password", formData.password);
    postData.append("email", formData.email);
    postData.append("phoneNumber", formData.phoneNumber);



    ClientService.register(postData).then(
      () => {
        Swal.close();
        Swal.fire(
          "Na adres email: " +
            formData.email +
            " został wysłany link aktywacyjny do konta"
        );
        navigate("/login");
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
          <p className="font-weight-bold">Podaj swoje dane, aby kontynuować</p>
        </div>
        <Row>
          <Col col="6">
            <InputGroup className="p-2">
              <InputGroup.Text>
                <CiUser />
              </InputGroup.Text>
              <Form.Control
                name="name"
                required
                type="text"
                placeholder="Imie"
                className="rounded-end"
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Imie jest wymagane
              </Form.Control.Feedback>
            </InputGroup>
          </Col>

          <Col col="6">
            <InputGroup className="p-2">
              <InputGroup.Text>
                <FaUserFriends />
              </InputGroup.Text>
              <Form.Control
                name="lastname"
                required
                type="text"
                placeholder="Nazwisko"
                className="rounded-end"
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Nazwisko jest wymagane
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Row>

        <InputGroup className="p-2">
          <InputGroup.Text>
            <IoMdPhonePortrait />
          </InputGroup.Text>
          <Form.Control
            name="phoneNumber"
            required
            type="number"
            placeholder="Numer telefonu"
            className="rounded-end"
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Numer telefonu jest wymagany
          </Form.Control.Feedback>
        </InputGroup>

        <div className="text-center mt-3">
          <p className="font-weight-bold">Podaj dane do logowania</p>
        </div>

        <Row>
          <Col col="6">
            <InputGroup className="p-2">
              <InputGroup.Text>
                <MdOutlineAlternateEmail />
              </InputGroup.Text>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="name@example.com"
                className="rounded-end"
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Adres email jest wymagany
              </Form.Control.Feedback>
            </InputGroup>
          </Col>

          <Col col="6">
            <InputGroup className="p-2">
              <InputGroup.Text>
                <TbPassword />
              </InputGroup.Text>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Hasło"
                className="rounded-end"
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Hasło jest wymagane
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Row>
        <div className="mt-2"></div>
        <OverlayTrigger
          placement="top"
          overlay={tooltip("Przycisk rejestracji")}
        >
          <Button
            type="submit"
            className="w-100 mb-4 font-weight-bold"
            size="md"
          >
            Zarejestruj
          </Button>
        </OverlayTrigger>
      </Form>

      <div className="text-center">
        <p>
          Masz już konto?<a href="/login"> Zaloguj się</a>
        </p>
      </div>

      {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )}
    </Container>
  );
};

export default Register;
