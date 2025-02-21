import React, { useEffect, useState } from "react";

import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import { MdLocationCity } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import { MdNumbers } from "react-icons/md";
import { MdFormatListNumbered } from "react-icons/md";
import { IoMdCodeWorking } from "react-icons/io";
import { MdOutlineDescription } from "react-icons/md";
import Swal from "sweetalert2";
import AddressService from "../../../service/AddressService";

const AddAddress = (props) => {
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState({});
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cityName: "",
    zipCode: "",
    streetName: "",
    buldingNumber: "",
    apartmentNumber: 0,
    description: "",
    accessCode: "",
  });
  const handleClose = () => window.location.reload();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const postData = new FormData();
    postData.append("cityName", formData.cityName);
    postData.append("zipCode", formData.zipCode);
    postData.append("streetName", formData.streetName);
    postData.append("buldingNumber", formData.buldingNumber);
    postData.append("apartmentNumber", formData.apartmentNumber);
    postData.append("description", formData.description);
    postData.append("accessCode", formData.accessCode);

    AddressService.addAddress(props.account, postData).then(
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
            setMessageList(error.response.data);
          }
        }
      }
    );
    setValidated(true);
  };

  // console.log(messageList)
  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Dodawania adresu</Modal.Title>
      </Modal.Header>
      {success ? (
        <div>
          <Modal.Body>
            <div className="alert alert-success" role="alert">
              Adres został pomyślnie dodany
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
              <p className="font-weight-bold">
                Podaj swoje szczegóły swojego adresu
              </p>
            </div>
            <Row>
              <Col col="6">
                <InputGroup className="p-2">
                  <InputGroup.Text>
                    <MdLocationCity />
                  </InputGroup.Text>
                  <Form.Control
                    name="cityName"
                    required
                    type="text"
                    placeholder="Miasto"
                    className="rounded-end"
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Nazwa miasta jest wymagane
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>

              <Col col="6">
                <InputGroup className="p-2">
                  <InputGroup.Text>
                    <MdLocationOn />
                  </InputGroup.Text>
                  <Form.Control
                    name="streetName"
                    required
                    type="text"
                    placeholder="Ulica"
                    className="rounded-end"
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Nazwa ulicy jest wymagane
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>

            <InputGroup className="p-2">
              <InputGroup.Text>
                <MdNumbers />
              </InputGroup.Text>
              <Form.Control
                name="zipCode"
                required
                type="text"
                placeholder="Kod pocztowy"
                className="rounded-end"
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Kod pocztowy jest wymagany
              </Form.Control.Feedback>
            </InputGroup>

            <Row>
              <Col col="6">
                <InputGroup className="p-2">
                  <InputGroup.Text>
                    <MdFormatListNumbered />
                  </InputGroup.Text>
                  <Form.Control
                    name="buldingNumber"
                    required
                    type="number"
                    placeholder="Numer budynku"
                    className="rounded-end"
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Numer budynku jest wymagany
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>

              <Col col="6">
                <InputGroup className="p-2">
                  <InputGroup.Text>
                    <MdFormatListNumbered />
                  </InputGroup.Text>
                  <Form.Control
                    name="apartmentNumber"
                    type="number"
                    placeholder="Numer mieszkania"
                    className="rounded-end"
                    onChange={handleChange}
                  />
                </InputGroup>
              </Col>
            </Row>
            <InputGroup className="p-2">
              <InputGroup.Text>
                <IoMdCodeWorking />
              </InputGroup.Text>
              <Form.Control
                name="accessCode"
                type="text"
                placeholder="Kod dostępu"
                className="rounded-end"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup className="p-2">
              <InputGroup.Text>
                <MdOutlineDescription />
              </InputGroup.Text>
              <Form.Control
                name="description"
                required
                as="textarea"
                placeholder="Opis"
                className="rounded-end"
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Opis jest wymagany
              </Form.Control.Feedback>
            </InputGroup>
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

export default AddAddress;
