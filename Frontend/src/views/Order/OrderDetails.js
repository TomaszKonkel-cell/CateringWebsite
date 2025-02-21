import React, { useEffect, useState } from "react";

import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";

import { IoMdCodeWorking } from "react-icons/io";
import {
  MdFormatListNumbered,
  MdLocationCity,
  MdLocationOn,
  MdNumbers,
  MdOutlineDescription,
  MdOutlineDisabledByDefault,
} from "react-icons/md";
import { GrInProgress, GrStatusGood } from "react-icons/gr";
import Swal from "sweetalert2";
import OrderService from "../../service/OrderService";
import AddressService from "../../service/AddressService";
import SuspensionDiet from "../Modals/OrderModal/SuspensionDiet";

const OrderDetails = () => {
  const [order, setOrder] = useState({});
  const [completedDays, setcompletedDays] = useState();
  const [orderAddress, setOrderAddress] = useState({});
  const [newOrderAddress, setNewOrderAddress] = useState();
  const [editDisable, setEditDisable] = useState(true);
  const [validated, setValidated] = useState(false);
  const [suspensionModal, setSuspensionModal] = useState(false);
  const [datesToSuspension, setDatesToSuspension] = useState([]);
  const [chosenItem, setChosenItem] = useState({});
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");

  if (!id) {
    Swal.fire("Brak parametru wskazującego zamówienie", "", "info");
  }

  const handleChange = (e) => {
    if (newOrderAddress == undefined) {
      setNewOrderAddress({ ...orderAddress, [e.target.name]: e.target.value });
    } else {
      setNewOrderAddress({
        ...newOrderAddress,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (newOrderAddress == undefined) {
      Swal.fire({
        text: "Żadne zmianny nie zostały dokonane",
        icon: "warning",
      });
    } else {
      const postData = new FormData();
      postData.append("cityName", newOrderAddress.cityName);
      postData.append("zipCode", newOrderAddress.zipCode);
      postData.append("streetName", newOrderAddress.streetName);
      postData.append("buldingNumber", newOrderAddress.buldingNumber);
      postData.append("apartmentNumber", newOrderAddress.apartmentNumber);
      postData.append("description", newOrderAddress.description);
      postData.append("accessCode", newOrderAddress.accessCode);

      AddressService.updateAddressForOrder(order.id, postData).then(
        () => {
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

  useEffect(() => {
    OrderService.getOrderDetails(id).then(
      (res) => {
        setOrder(res.data);
        setOrderAddress(res.data.address);
        getDaysForItem(res.data);
      },
      (error) => {
        Swal.fire(error.response.data, "", "error");
      }
    );
  }, []);

  const getDaysForItem = (order) => {
    OrderService.getCompletedDays(order).then(
      (res) => {
        setcompletedDays(res.data);
      },
      (error) => {
        Swal.fire(error.response.data, "", "error");
      }
    );
  };

  const getDatesForOrderItem = (id) => {

    OrderService.getDatesToSuspension(id).then((res) => {
      setDatesToSuspension(res.data)
    }, (error) => {
      Swal.fire({
        text: error.response.data.message,
        icon: "error",
      });
      console.log(error)
    })

  };

  const tooltip = (text) => (
    <Tooltip id="tooltip">
      <strong>{text}</strong>
    </Tooltip>
  );

  return (
    <Container
      style={{
        backgroundColor: "lightgray",
        maxHeight: "90%",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
      className="p-2 d-flex flex-column rounded-3 shadow-lg"
    >
      <Row className="m-2 ">
        <p className="fw-bold fs-5">Zamówienie - {order.id}</p>
      </Row>
      <Row className="d-flex justify-content-between m-2">
        <Col md="6" className="border border-1 bg-light rounded-3 ">
          <div className="d-flex justify-content-between border-bottom border-dark">
            <p className="p-2 fw-bold ">Dane adresowe</p>
            <Button
              className="m-2 "
              variant="outline-secondary"
              onClick={() => setEditDisable(false)}
            >
              Edytuj
            </Button>
          </div>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col col="6">
                <OverlayTrigger
                  placement="top"
                  overlay={tooltip("Nazwa miasta")}
                >
                  <InputGroup className="p-2">
                    <InputGroup.Text>
                      <MdLocationCity />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      name="cityName"
                      type="text"
                      defaultValue={orderAddress?.cityName}
                      className="rounded-end"
                      disabled={editDisable}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Nazwa miasta jest wymagane
                    </Form.Control.Feedback>
                  </InputGroup>
                </OverlayTrigger>
              </Col>

              <Col col="6">
                <OverlayTrigger
                  placement="top"
                  overlay={tooltip("Nazwa ulicy")}
                >
                  <InputGroup className="p-2">
                    <InputGroup.Text>
                      <MdLocationOn />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      name="streetName"
                      type="text"
                      defaultValue={orderAddress?.streetName}
                      className="rounded-end"
                      disabled={editDisable}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Nazwa ulicy jest wymagane
                    </Form.Control.Feedback>
                  </InputGroup>
                </OverlayTrigger>
              </Col>
            </Row>
            <OverlayTrigger placement="top" overlay={tooltip("Kod pocztowy")}>
              <InputGroup className="p-2">
                <InputGroup.Text>
                  <MdNumbers />
                </InputGroup.Text>
                <Form.Control
                  required
                  name="zipCode"
                  type="text"
                  defaultValue={orderAddress?.zipCode}
                  className="rounded-end"
                  disabled={editDisable}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Kod pocztowy jest wymagany
                </Form.Control.Feedback>
              </InputGroup>
            </OverlayTrigger>

            <Row>
              <Col col="6">
                <OverlayTrigger
                  placement="top"
                  overlay={tooltip("Numer budynku")}
                >
                  <InputGroup className="p-2">
                    <InputGroup.Text>
                      <MdFormatListNumbered />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      name="buldingNumber"
                      type="number"
                      defaultValue={orderAddress?.buldingNumber}
                      className="rounded-end"
                      disabled={editDisable}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Numer budynku jest wymagany
                    </Form.Control.Feedback>
                  </InputGroup>
                </OverlayTrigger>
              </Col>

              <Col col="6">
                <OverlayTrigger
                  placement="top"
                  overlay={tooltip("Numer mieszkania")}
                >
                  <InputGroup className="p-2">
                    <InputGroup.Text>
                      <MdFormatListNumbered />
                    </InputGroup.Text>
                    <Form.Control
                      name="apartmentNumber"
                      type="number"
                      defaultValue={orderAddress?.apartmentNumber}
                      className="rounded-end"
                      disabled={editDisable}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </OverlayTrigger>
              </Col>
            </Row>
            <OverlayTrigger placement="top" overlay={tooltip("Kod dostępu")}>
              <InputGroup className="p-2">
                <InputGroup.Text>
                  <IoMdCodeWorking />
                </InputGroup.Text>
                <Form.Control
                  name="accessCode"
                  type="text"
                  defaultValue={orderAddress?.accessCode}
                  className="rounded-end"
                  disabled={editDisable}
                  onChange={handleChange}
                />
              </InputGroup>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={tooltip("Opis zamówienia")}
            >
              <InputGroup className="p-2">
                <InputGroup.Text>
                  <MdOutlineDescription />
                </InputGroup.Text>
                <Form.Control
                  required
                  name="description"
                  as="textarea"
                  defaultValue={orderAddress?.description}
                  className="rounded-end"
                  disabled={editDisable}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Opis jest wymagany
                </Form.Control.Feedback>
              </InputGroup>
            </OverlayTrigger>

            <div className="d-flex justify-content-end m-2">
              <Button
                className="mt-2 mb-4"
                type="submit"
                disabled={editDisable}
              >
                Zmień dane adresu
              </Button>
            </div>
          </Form>
        </Col>
        <Col md="6" className="border border-1 bg-light rounded-3 ">
          <div className="d-flex justify-content-between border-bottom border-dark">
            <p className="p-2 fw-bold ">Lista pozycji</p>
          </div>

          {order.listOfItems?.map((item) => {
            return (
              <>
                <div className="m-1 d-flex justify-content-between">
                  <li>
                    {item.quantity} x {item.diet.name}{" "}
                    {item.diet.calories > 0
                      ? item.diet.calories
                      : item.diet.size}
                  </li>

                  <p>
                    {item.diet.pricePerUnit *
                      item.quantity *
                      item.numberOfDays *
                      item.discount}{" "}
                    zł
                  </p>
                </div>
                <div>
                  <p className="text-end small">
                    {" "}
                    Zrealizowane: {completedDays && completedDays[item.id]}/{item.numberOfDays} dni

                    {completedDays && completedDays[item.id] == 0 ? (
                      <MdOutlineDisabledByDefault size={24} color="red" className="m-1" />
                    ) : null}

                    {(completedDays && completedDays[item.id] > 0) && (completedDays && completedDays[item.id] != item.numberOfDays) ? (
                      <GrInProgress size={24} color="orange" className="m-1" />
                    ) : null}

                    {completedDays && completedDays[item.id] == item.numberOfDays ? (
                      <GrStatusGood size={24} color="green" className="m-1" />
                    ) : null}

                  </p>
                </div>
                <div className="d-flex justify-content-between border-bottom p-2">

                  <OverlayTrigger
                    placement="top"
                    overlay={tooltip(
                      "Zawieś diete"
                    )}
                  ><Button disabled={completedDays && completedDays[item.id] != item.numberOfDays ? false : true} size="sm h-25" onClick={() => {
                    setChosenItem(item)
                    setSuspensionModal(true)
                    getDatesForOrderItem(item.id)
                  }}>Wstrzymanie</Button>
                  </OverlayTrigger>



                  <p className="small">
                    {item.startDate}
                    {item.orderDates.length > 1
                      ? " - " + item.orderDates[item.orderDates.length - 1]
                      : null}
                    ,{" "}
                    {item.numberOfDays > 1
                      ? item.numberOfDays + " dni"
                      : item.numberOfDays + " dzień"}
                  </p>
                </div>
              </>
            );
          })}
          <p className="fw-bold m-2 text-end">
            Suma dostawy: {order.shipment} zł
          </p>
        </Col>
      </Row>
      <Row className="m-2">
        <Col md="12" className="bg-light rounded-3 d-flex justify-content-end">
          <p className="m-2">Suma zamówienia: {order.totalPrice} zł</p>
        </Col>
      </Row>

      <SuspensionDiet show={suspensionModal} item={chosenItem} datesToSuspension={datesToSuspension} />
    </Container>
  );
};

export default OrderDetails;
