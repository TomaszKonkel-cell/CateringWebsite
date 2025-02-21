import React, { useEffect, useState } from "react";

import {
  Accordion,
  AccordionBody,
  Button,
  Card,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

import secureLocalStorage from "react-secure-storage";

import { FaPlus } from "react-icons/fa";
import { TbListDetails, TbMinus } from "react-icons/tb";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddressService from "../../service/AddressService";
import ClientService from "../../service/ClientService";
import AddAddress from "../Modals/AddressModals/AddAddress";

import ConfirmPass from "../Modals/ClientModals/ConfirmPass";
import DetailsAddress from "../Modals/AddressModals/DetailsAddress";
import OrderService from "../../service/OrderService";
import ClientOrders from "../Modals/ClientModals/ClientOrders";

const ClientAccount = () => {
  let navigate = useNavigate();
  const [orders, setOrders] = useState();
  const [addresses, setAddresses] = useState();
  const [newAccount, setNewAccount] = useState();
  const [newPass, setNewPass] = useState("");
  const [modalAddAddress, setModalAddAddress] = useState(false);
  const [modalDetailsAddress, setModalDetailsAddress] = useState(false);
  const [modalConfirmPass, setModalConfirmPass] = useState(false);
  const [modalClientOrders, setModalClientOrders] = useState(false);
  const [address, setAddress] = useState();
  const [validated, setValidated] = useState(false);
  const logged = ClientService.getCurrentClient();

  const handleShowAdd = () => setModalAddAddress(true);

  const handleShowDetails = (address) => {
    setModalDetailsAddress(true);
    setAddress(address);
  };

  const handleShowOrders = () => setModalClientOrders(true);

  const handleChange = (e) => {
    if (newAccount == undefined) {
      setNewAccount({ ...logged, [e.target.name]: e.target.value });
    } else {
      setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
    }
  };
  const handleChangePass = (e) => {
    setNewPass(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (newAccount == undefined) {
      Swal.fire({
        text: "Żadne zmianny nie zostały dokonane",
        icon: "warning",
      });
    } else {
      const postData = new FormData();
      postData.append("name", newAccount.name);
      postData.append("lastname", newAccount.lastname);
      postData.append("email", newAccount.username);
      postData.append("phoneNumber", newAccount.phoneNumber);

      ClientService.updateClient(newAccount.id, postData).then(
        () => {
          secureLocalStorage.setItem("client", JSON.stringify(newAccount));
          navigate("/account");
          Swal.fire({
            text: "Dane zostały zmienione",
            icon: "success",
          });
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
                text: error.response.data,
                icon: "error",
              });
            }
            if (typeof error.response.data == "object") {
              Swal.fire({
                text: error.response.data.errors + "\n",
                icon: "error",
              });
            }
          }
        }
      );
    }
    setValidated(true);
  };

  const handleSubmitPass = () => {
    if (newPass.length > 0) {
      setModalConfirmPass(true);
    } else {
      Swal.fire({
        text: "Aby przejść dalej musisz wpisać nowe hasło",
        icon: "warning",
      });
    }
  };

  const handleDelete = (id) => {
    AddressService.deleteAddress(id).then(
      () => {
        Swal.fire({
          text: "Adres usunięty",
          icon: "success",
        });
      },
      (error) => {
        Swal.fire({
          text: error.response.data,
          icon: "error",
        });
      }
    );
  };

  useEffect(() => {
    if (!logged) {
      navigate("/login");
    } else {
      AddressService.getAddressesForClient().then((res) => {
        setAddresses(res.data);
      });
      OrderService.getAllClientOrders(0, 5).then((res) => {
        setOrders(res.data);
      });
    }
  }, [addresses]);

  const tooltip = (text) => (
    <Tooltip id="tooltip">
      <strong>{text}</strong>
    </Tooltip>
  );

  return (
    <Container
      style={{
        backgroundColor: "lightgray",
        maxHeight: "80%",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
      className="p-4 d-flex flex-column rounded-3 shadow-lg"
    >
      <Row>
        <Col lg="8">
          <Card className="mb-2">
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col sm="3">
                    <Card.Text>Imie</Card.Text>
                  </Col>
                  <Col sm="9">
                    <Form.Control
                      required
                      name="name"
                      type="text"
                      defaultValue={logged?.name}
                      style={{ border: 0 }}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Imie nie może być puste
                    </Form.Control.Feedback>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm="3">
                    <Card.Text>Nazwisko</Card.Text>
                  </Col>
                  <Col sm="9">
                    <Form.Control
                      required
                      name="lastname"
                      type="text"
                      defaultValue={logged?.lastname}
                      style={{ border: 0 }}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Nazwisko nie może być puste
                    </Form.Control.Feedback>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm="3">
                    <Card.Text>Email</Card.Text>
                  </Col>
                  <Col sm="9">
                    <Form.Control
                      required
                      name="email"
                      type="text"
                      defaultValue={logged?.username}
                      style={{ border: 0 }}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Adres email nie może być pusty
                    </Form.Control.Feedback>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm="3">
                    <Card.Text>Numer tel.</Card.Text>
                  </Col>
                  <Col sm="9">
                    <Form.Control
                      required
                      name="phoneNumber"
                      type="text"
                      defaultValue={logged?.phoneNumber}
                      style={{ border: 0 }}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      NUmer telefonu może być puste
                    </Form.Control.Feedback>
                  </Col>
                </Row>
                <hr />
                <Row className="p-4">
                  <OverlayTrigger
                    placement="top"
                    overlay={tooltip(
                      "Nadpisz dane zmienione w formularzu powyżej"
                    )}
                  >
                    <Button
                      type="submit"
                      variant="outline-primary"
                      className="shadow-lg"
                    >
                      Edytuj dane
                    </Button>
                  </OverlayTrigger>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Row>
                <Col sm="12" className="mb-1 d-flex justify-content-between">
                  <Card.Text>Adresy</Card.Text>
                  <a onClick={handleShowAdd}>
                    <FaPlus />
                  </a>
                </Col>
                <Row className="ml-1">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Książka adresowa</Accordion.Header>
                      <Accordion.Body>
                        {addresses && addresses.length == 0
                          ? "Brak adresów"
                          : null}
                        {addresses &&
                          addresses.map((address) => {
                            return (
                              <Row>
                                <Col>
                                  <Card.Text className="text-muted">
                                    {address.cityName}, {address.streetName}{" "}
                                    {address.buldingNumber}
                                    {address.apartmentNumber > 0
                                      ? `/${address.apartmentNumber}`
                                      : null}
                                    , {address.zipCode}
                                  </Card.Text>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                  <a
                                    onClick={() => {
                                      handleShowDetails(address);
                                    }}
                                  >
                                    <TbListDetails />
                                  </a>
                                  <a
                                    onClick={() => {
                                      handleDelete(address.id);
                                    }}
                                  >
                                    <TbMinus color="red" />
                                  </a>
                                </Col>
                              </Row>
                            );
                          })}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Row>
              </Row>
              <hr />
              <Row>
                <Col sm="12" className="mb-4 d-flex justify-content-between">
                  <p>Hasło: </p>

                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Podaj nowe hasło"
                    onChange={handleChangePass}
                    className="w-75"
                  />
                  <OverlayTrigger
                    placement="top"
                    overlay={tooltip("Zatwierdź hasło wpisane obok")}
                  >
                    <Button onClick={handleSubmitPass}>Zapisz</Button>
                  </OverlayTrigger>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-2">
            <Card.Body>
              <Row>
                <Col className="mb-2">
                  <Card.Text>Aktywne zamówienie</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="4">
          <Row className="mb-4">
            <Col>Zalogowany jako:</Col>
            <Col className="text-right font-weight-bold">
              {logged?.fullName}
            </Col>
          </Row>
          <Button className="w-100 mb-3" onClick={handleShowOrders}>
            Wszystkie zamówienia
          </Button>
          <Row>
            <Col>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Zamówienia</Accordion.Header>
                  {orders &&
                    orders.content.map((order) => {
                      return (
                        <Accordion.Body className="m-1 rounded-3 bg-light">
                          <p>Zamówienie - {order.id}</p>
                          {order.listOfItems.map((item) => {
                            return (
                              <div className="d-flex flex-column border border-1 rounded-3 pt-3 mb-1">
                                <p className="mb-1 text-center">
                                  {item.quantity} x {item.diet.name}{" "}
                                  {item.diet.calories > 0
                                    ? "- " + item.diet.calories + " kcal"
                                    : item.diet.size}
                                </p>
                                <p
                                  style={{ fontSize: 12 }}
                                  className="font-italic"
                                >
                                  <p className="font-italic text-center">
                                    {item.startDate}
                                    {item.orderDates.length > 1
                                      ? " - " +
                                        item.orderDates[
                                          item.orderDates.length - 1
                                        ]
                                      : null}
                                    ,{" "}
                                    {item.numberOfDays > 1
                                      ? item.numberOfDays + " dni"
                                      : item.numberOfDays + " dzień"}
                                  </p>
                                </p>
                              </div>
                            );
                          })}
                        </Accordion.Body>
                      );
                    })}
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Col>
      </Row>

      <AddAddress show={modalAddAddress} account={logged?.id} />
      <DetailsAddress show={modalDetailsAddress} address={address && address} />
      <ConfirmPass
        show={modalConfirmPass}
        newPassword={newPass}
        account={logged?.id}
      />
      <ClientOrders show={modalClientOrders} />
    </Container>
  );
};

export default ClientAccount;
