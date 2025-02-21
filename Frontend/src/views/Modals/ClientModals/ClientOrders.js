import React, { useEffect, useState } from "react";

import { Pagination } from "@mui/material";
import { Accordion, Button, Col, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ClientService from "../../../service/ClientService";
import OrderService from "../../../service/OrderService";

const ClientOrders = (props) => {
  const [orders, setOrders] = useState();
  const [page, setPage] = useState(0);
  const logged = ClientService.getCurrentClient();
  let navigate = useNavigate();

  const handleClose = () => window.location.reload();

  const handleChange = (event, value) => setPage(value - 1);

  useEffect(() => {
    if (!logged) {
      navigate("/login");
    } else {
      OrderService.getAllClientOrders(page, 10).then((res) => {
        setOrders(res.data);
      });
    }
  }, [orders]);

  return (
    <Modal show={props.show} onHide={handleClose} scrollable={true} className="modal-lg" style={{maxWidth: "100%"}}>
      <Modal.Header closeButton>
        <Modal.Title>Zamówienia dla klienta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center mb-3">
          <Pagination
            count={orders && orders.totalPages}
            onChange={handleChange}
          />
        </div>
        {orders &&
          orders.content.map((order) => {
            return (
              <>
                <Accordion defaultActiveKey="0" className="mb-3">
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      <p className="fw-bold">
                        Zamówienie - {order.id} : {order.address.cityName},{" "}
                        {order.address.streetName},{" "}
                        {order.address.buldingNumber}/
                        {order.address.apartmentNumber}, {order.address.zipCode}
                      </p>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        {order.listOfItems.map((item) => {
                          return (
                            <div className="d-flex justify-content-between border-bottom border-1">
                              <p className="">
                                {item.quantity} x {item.diet.name}{" "}
                                {item.diet.calories > 0
                                  ? "- " + item.diet.calories + " kcal"
                                  : item.diet.size}
                              </p>

                              <p className="font-italic">
                                {item.startDate}
                                {item.orderDates.length > 1
                                  ? " - " +
                                    item.orderDates[item.orderDates.length - 1]
                                  : null}
                                ,{" "}
                                {item.numberOfDays > 1
                                  ? item.numberOfDays + " dni"
                                  : item.numberOfDays + " dzień"}
                              </p>
                            </div>
                          );
                        })}
                      </Row>

                      <Row className="mt-3">
                        <Col md="12" className="d-flex justify-content-between">
                          <p className="">Cena diet: </p>

                          <p className="font-italic">
                            {order.totalPrice - order.shipment} zł
                          </p>
                        </Col>
                        <Col md="12" className="d-flex justify-content-between">
                          <p className="">Dostawa: </p>

                          <p className="font-italic">{order.shipment} zł</p>
                        </Col>
                        <Col md="12" className="d-flex justify-content-end">
                          <p className="fw-bold font-italic">
                            Suma: {order.totalPrice} zł
                          </p>
                        </Col>
                        <Button size="sm" className="shadow-lg" onClick={() => {navigate(`/orderDetails?id=${order.id}`);}}>
                          Przejdź do
                        </Button>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </>
            );
          })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Anuluj
        </Button>
        <Button type="submit" variant="primary">
          Zapisz
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClientOrders;
