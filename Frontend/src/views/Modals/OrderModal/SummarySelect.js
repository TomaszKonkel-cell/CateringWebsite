import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";

import Modal from "react-bootstrap/Modal";
import { FiMinus, FiPlus } from "react-icons/fi";
import OrderService from "../../../service/OrderService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SummarySelect = (props) => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState();

  const handleClose = () => window.location.reload();

  const handleAdd = (data) => {
    OrderService.addToOrder(data).then(
      () => {
        Swal.fire({
          text: "Dieta została dodana za zamówienia",
          icon: "success",
        });
        navigate("/order");
      },
      (error) => {
        Swal.fire({
          text: error.response.data.message,
          icon: "error",
        });
      }
    );
  };

  useEffect(() => {
    setFormData(props.item);
  }, [props.item]);

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Wybrano: </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-row align-items-center">
                <div>

                    <p className="font-weight-bold">
                      {formData && formData.diet?.name}{" "}
                      {formData && formData.diet?.calories > 0 ? "- " + formData && formData.diet?.calories + " kcal" : formData && formData.diet?.size}
                    </p>


                  <p className="small mb-0">
                    Od: {formData && formData.startDate},{" "}
                    {formData && formData.numberOfDays} dni
                  </p>
                  {formData && formData.weekend ? <p>Z sobotami</p> : null}
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <div className="d-flex justify-content-between">
                  <FiMinus
                    size={24}
                    className="mr-2"
                    onClick={() => {
                      if (formData.quantity > 1) {
                        setFormData({
                          ...formData,
                          ["quantity"]: formData.quantity - 1,
                        });
                      }
                    }}
                  />
                  <p className="font-weight-bold m-auto">
                    {formData && formData.quantity}
                  </p>
                  <FiPlus
                    size={24}
                    className="ml-2"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        ["quantity"]: formData.quantity + 1,
                      });
                    }}
                  />
                </div>
                <div>
                  <p tag="h5" className="m-3">
                    {(formData && formData.quantity) *
                      (formData && formData.numberOfDays) *
                      (formData && formData.diet?.pricePerUnit)}{" "}
                    zł
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => handleAdd(formData)}>Akceptuj</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SummarySelect;
