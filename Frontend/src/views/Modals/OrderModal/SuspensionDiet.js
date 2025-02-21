import React, { useEffect, useState } from "react";

import { Button, Form, Modal } from "react-bootstrap";
import OrderService from "../../../service/OrderService";
import Swal from "sweetalert2";
import { error } from "jquery";

const SuspensionDiet = (props) => {
  const [chosenDates, setChosenDates] = useState([]);
  const handleClose = () => window.location.reload();

  const confirmSuspenion = () => {
    OrderService.suspensionDiet(chosenDates, props.item.id).then(
      (res) => {
        Swal.fire({
          html: "Wstrzymano diety na:<br>" + res.data,
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

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Wybierz date do zawieszenia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="font-weight-bold">Wybrano diete: {props.item.diet?.name}{" "}
                    {props.item.diet?.calories > 0
                      ? props.item.diet?.calories
                      : props.item.diet?.size}</p>
        <Form.Control
          className="w-100 mb-2"
          as="select"
          onChange={(e) => setChosenDates([...chosenDates, e.target.value])}

        >
          <option>Wybierz date...</option>
          {props.datesToSuspension?.map((date) => {
            return (
              <option>{date}</option>

            );
          })}

        </Form.Control>

        <div className="m-2">
          {chosenDates.length > 0 ? (
            <p>Wybrane: </p>
          ) : null}

          {chosenDates?.map((date) => {
            return (
              <li>{date}</li>
            );
          })}
        </div>


      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        Wybrano: {chosenDates.length} dni
        <Button disabled={chosenDates.length > 0 ? false : true} onClick={confirmSuspenion}>Potwierdź</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuspensionDiet;
