import React, { useEffect, useState } from "react";

import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FiArrowRight, FiMinus, FiPlus, FiTrash } from "react-icons/fi";
import Swal from "sweetalert2";
import ClientService from "../../service/ClientService";
import OrderService from "../../service/OrderService";
import AddressChoose from "../Modals/OrderModal/AddressChoose";

const Order = () => {
  const [order, setOrder] = useState(OrderService.getOrder());
  const [summary, setSummary] = useState();
  const [addressChoose, setAddressChoose] = useState(false);

  const decrease = (item) => {
    OrderService.decrease(item).then((res) => {
      setOrder(res);
      OrderService.getSummaryOfPrice().then((res) => {
        setSummary(res.data);
      });
    });
  };

  const increase = (item) => {
    OrderService.increase(item).then((res) => {
      setOrder(res);
      OrderService.getSummaryOfPrice().then((res) => {
        setSummary(res.data);
      });
    });
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: "Potwierdzasz usunięcie pozycji?",
      showDenyButton: true,
      confirmButtonText: "TAK",
      denyButtonText: `NIE`,
      icon: "question",
    }).then((result) => {
      if (result.isConfirmed) {
        OrderService.deleteItem(id).then((res) => {
          Swal.fire("Pozycja usunięta", "", "success");
          setOrder(res);
          OrderService.getSummaryOfPrice().then((res) => {
            setSummary(res.data);
          });
        });
      } else if (result.isDenied) {
        Swal.fire("Operacje anulowano", "", "info");
      }
    });
  };

  useEffect(() => {
    OrderService.getSummaryOfPrice().then((res) => {
      setSummary(res.data);
    });
  }, []);
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
      {order.length == 0 ? (
        <div className="mb-4">
          <h1 className="fw-normal m-3 text-center">Zamówienie puste</h1>
        </div>
      ) : (
        <Row>
          <div className="mb-4">
            <h1 className="fw-normal m-1 text-black">Lista zamówienia</h1>
          </div>
          <Col md="6">
            {order &&
              order.map((item) => {
                return (
                  <Card className="rounded-3 mb-3">
                    <Card.Header>
                      <p className="font-weight-bold mb-0">
                        {item.diet.name}{" "}
                        {item.diet.calories > 0
                          ? "- " + item.diet.calories + " kcal"
                          : item.diet.size}
                      </p>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md="4">
                          <div>
                            <p className="small mb-0">Od: {item.startDate}</p>
                            <p className="small mb-0">
                              Na: {item.numberOfDays} dni
                            </p>
                            <p className="small mb-0">
                              {parseFloat(
                                item.diet?.pricePerUnit *
                                  item.quantity *
                                  item.discount
                              ).toFixed(2)}{" "}
                              zł/dzień
                            </p>
                          </div>
                        </Col>
                        <Col
                          md="8"
                          className="d-flex align-items-center justify-content-around"
                        >
                          <div className="d-flex">
                            <FiMinus
                              size={24}
                              onClick={() => {
                                decrease(item);
                              }}
                            />
                            <p className="font-weight-bold ml-2 mr-2">
                              {item.quantity}
                            </p>
                            <FiPlus
                              size={24}
                              onClick={() => {
                                increase(item);
                              }}
                            />
                          </div>
                          {item.discount == 1 ? (
                            <div>
                              <p className="small text-center fw-bold">
                                {parseFloat(
                                  item.quantity *
                                    item.diet?.pricePerUnit *
                                    item.numberOfDays
                                ).toFixed(2)}{" "}
                                zł
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-decoration-line-through text-center">
                                {parseFloat(
                                  item.quantity *
                                    item.diet?.pricePerUnit *
                                    item.numberOfDays
                                ).toFixed(2)}{" "}
                                zł
                              </p>
                              <p className="small text-center fw-bold">
                                {parseFloat(
                                  item.quantity *
                                    item.diet?.pricePerUnit *
                                    item.numberOfDays *
                                    item.discount
                                ).toFixed(2)}{" "}
                                zł
                              </p>
                            </div>
                          )}

                          <div className="justify-content-around mb-3">
                            <FiTrash
                              color="red"
                              size={24}
                              onClick={() => {
                                deleteItem(item);
                              }}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                );
              })}
          </Col>
          <Col md="6">
            <Card className="rounded-3 mb-4">
              <Card.Header>
                <p className="mb-0">Summary</p>
              </Card.Header>
              <Card.Body>
                <p className="d-flex justify-content-between align-items-center">
                  Diety
                  <span>{summary?.basicPrice} zł</span>
                </p>

                {summary?.discount > 0 ? (
                  <p className="d-flex justify-content-between align-items-center">
                    Rabat za liczbe dni
                    <span>- {parseFloat(summary?.discount).toFixed(2)} zł</span>
                  </p>
                ) : null}

                <p className="d-flex justify-content-between align-items-center px-0">
                  Dostawa
                  <span>{summary?.shipment} zł</span>
                </p>
                <hr />
                <p className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                  <div>
                    <strong>Suma</strong>
                  </div>
                  <span>
                    <strong>{summary?.totalPrice} zł</strong>
                  </span>
                </p>

                <Button
                  className="w-100"
                  onClick={() => setAddressChoose(true)}
                >
                  Dalej
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <AddressChoose show={addressChoose} />
    </Container>
  );
};

export default Order;
