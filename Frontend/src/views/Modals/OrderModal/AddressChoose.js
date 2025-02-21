import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import AddressService from "../../../service/AddressService";
import OrderService from "../../../service/OrderService";
import { useNavigate } from "react-router-dom";

const AddressChoose = (props) => {
    let navigate = useNavigate();
  const [addresses, setAddresses] = useState();
  const [chosenAddress, setChosenAddress] = useState();

  const handleClose = () => window.location.reload();

  const choose = (address) => setChosenAddress(address);
  const handlePost = (address) => {
    OrderService.postOrder(address).then(
      () => {
        Swal.fire({
            text: "Zamówienie zostało złożone",
            icon: "success",
          });
        OrderService.clearOrder();
        navigate('/account')
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
  };

  useEffect(() => {
    AddressService.getAddressesForClient().then((res) => {
      setAddresses(res.data);
    });
  }, [addresses]);

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Dostępne adresy: </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addresses &&
          addresses.map((address) => {
            return (
              <div className="d-flex mb-1">
                <Button
                  className="w-100 text-black"
                  variant={
                    chosenAddress?.id == address.id
                      ? "success"
                      : "outline-secondary"
                  }
                  onClick={() => {
                    choose(address);
                  }}
                >
                  {address.cityName}, {address.streetName}{" "}
                  {address.buldingNumber}
                  {address.apartmentNumber > 0
                    ? `/${address.apartmentNumber}`
                    : null}
                  , {address.zipCode}
                </Button>
              </div>
            );
          })}
      </Modal.Body>
      {chosenAddress ? (
        <Modal.Footer>
          <div className="d-flex w-100 justify-content-between">
            <p>
              Wybrano: {chosenAddress.cityName}, {chosenAddress.streetName}{" "}
              {chosenAddress.buldingNumber}
              {chosenAddress.apartmentNumber > 0
                ? `/${chosenAddress.apartmentNumber}`
                : null}
              , {chosenAddress.zipCode}
            </p>
            <Button onClick={() => handlePost(chosenAddress)}>Akceptuj</Button>
          </div>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
};

export default AddressChoose;
