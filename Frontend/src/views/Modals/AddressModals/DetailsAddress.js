import React, { useEffect, useState } from "react";

import { Modal, Button, Col, Form, InputGroup, Row } from "react-bootstrap";

import { MdLocationCity } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import { MdNumbers } from "react-icons/md";
import { MdFormatListNumbered } from "react-icons/md";
import { IoMdCodeWorking } from "react-icons/io";
import { MdOutlineDescription } from "react-icons/md";
import Swal from "sweetalert2";
import AddressService from "../../../service/AddressService";

const DetailsAddress = (props) => {
  const [address, setAddress] = useState();
  const [newAddress, setNewAddress] = useState();
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState({});
  const [success, setSuccess] = useState(false);

  const handleClose = () => window.location.reload();
  const handleChange = (e) => {
    if (newAddress == undefined) {
      setNewAddress({ ...address, [e.target.name]: e.target.value });
    } else {
      setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (newAddress == undefined) {
      Swal.fire({
        text: "Żadne zmianny nie zostały dokonane",
        icon: "warning",
      });
    } else {
      const postData = new FormData();
      postData.append("cityName", newAddress.cityName);
      postData.append("zipCode", newAddress.zipCode);
      postData.append("streetName", newAddress.streetName);
      postData.append("buldingNumber", newAddress.buldingNumber);
      postData.append("apartmentNumber", newAddress.apartmentNumber);
      postData.append("description", newAddress.description);
      postData.append("accessCode", newAddress.accessCode);

      AddressService.updateAddress(newAddress.id, postData).then(
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
    }
  };

  useEffect(() => {
    setAddress(props.address);
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
              Adres został pomyślnie zmieniony
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
              <p className="font-weight-bold">Szczegóły adresu</p>
            </div>
            <Row>
              <Col col="6">
                <InputGroup className="p-2">
                  <InputGroup.Text>
                    <MdLocationCity />
                  </InputGroup.Text>
                  <Form.Control
                    required
                    name="cityName"
                    type="text"
                    defaultValue={address && address.cityName}
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
                    required
                    name="streetName"
                    type="text"
                    defaultValue={address && address.streetName}
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
                required
                name="zipCode"
                type="text"
                defaultValue={address && address.zipCode}
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
                    required
                    name="buldingNumber"
                    type="number"
                    defaultValue={address && address.buldingNumber}
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
                    defaultValue={address && address.apartmentNumber}
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
                defaultValue={address && address.accessCode}
                className="rounded-end"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup className="p-2">
              <InputGroup.Text>
                <MdOutlineDescription />
              </InputGroup.Text>
              <Form.Control
                required
                name="description"
                as="textarea"
                defaultValue={address && address.description}
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

export default DetailsAddress;
