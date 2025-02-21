import React, { useEffect, useState } from "react";

import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { useLocation } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

import { FiMinus, FiPlus } from "react-icons/fi";

import DietService from "../../service/DietService";
import SummarySelect from "../Modals/OrderModal/SummarySelect";
import Swal from "sweetalert2";

const DietDetails = () => {
  const [currentDiet, setCurrentDiet] = useState([]);
  const [currentVariant, setCurrentVariant] = useState();
  const [startDate, setStartDate] = useState(
    dayjs().add(2, "day").format("YYYY-MM-DD")
  );
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [weekend, setWeekend] = useState(false);
  const [summaryShow, setSummaryShow] = useState(false);
  const [item, setItem] = useState({});

  const location = useLocation();
  const name = new URLSearchParams(location.search).get("name");

  if (!name) {
    Swal.fire("Brak parametru wskazującego diete", "", "info");
  }

  const getDiscount = () => {
    if (numberOfDays > 1 && numberOfDays <= 15) {
      return 0.95;
    }
    if (numberOfDays > 15) {
      return 0.9;
    }
    return 1;
  };

  useEffect(() => {
    DietService.getDietByName(name).then((res) => {
      setCurrentDiet(res.data);
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
      className="p-2 d-flex flex-column w-50 rounded-3 shadow-lg"
    >
      <Row
        className="rounded-3 shadow-lg m-4"
        style={{ backgroundColor: "white" }}
      >
        <Col md="6">
          <p className="font-weight-bold m-2" style={{ fontSize: 36 }}>
            {currentDiet && currentDiet[0]?.name}
          </p>
        </Col>
        <Col md="6">
          <p className="text-end m-2" style={{ fontSize: 20 }}>
            {currentVariant ? (
              <p>
                Wariant:{" "}
                <span className="font-weight-bold">
                  {!isNaN(+currentVariant?.calories)
                    ? currentVariant.calories + "kcal"
                    : currentVariant.calories}
                </span>
              </p>
            ) : (
              <p>Nie wybrano</p>
            )}
          </p>
          <p className="text-end m-2" style={{ fontSize: 16 }}>
            Data rozpoczęcia:{" "}
            <span className="font-weight-bold">{startDate}</span>
          </p>
        </Col>
      </Row>

      <Row className="p-2 m-3">
        <Col
          md={currentVariant ? "6" : "12"}
          className="p-2 rounded bg-white border-1 border"
        >
          <p className="font-weight-bold m-2" style={{ fontSize: 20 }}>
            Wybierz wariant:{" "}
          </p>

          {currentDiet &&
            currentDiet?.map((diet, index) => {
              return (
                <Col md="4" className="d-inline-flex mt-4" key={index}>
                  <Button
                    style={{ width: "100px", height: "100px" }}
                    className="w-100 m-2 p-3 shadow-lg"
                    variant={
                      index === currentVariant?.index
                        ? "success"
                        : "outline-secondary"
                    }
                    onClick={(e) => {
                      const variant = {
                        index: index,
                        calories: diet.calories > 0 ? diet.calories : diet.size,
                      };
                      setCurrentVariant(variant);
                    }}
                  >
                    {diet.calories > 0 ? diet.calories + " kcal" : diet.size}
                  </Button>
                </Col>
              );
            })}
        </Col>
        {currentVariant ? (
          <Col md="6" className="p-2 rounded bg-white border-1 border">
            <p className="font-weight-bold m-2" style={{ fontSize: 20 }}>
              Wybierz date startowa:{" "}
            </p>
            <hr />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                disabled={currentVariant ? false : true}
                disablePast
                minDate={dayjs().add(2, "day")}
                onChange={(newValue) => {
                  setStartDate(newValue.format("YYYY-MM-DD"));
                }}
              />
            </LocalizationProvider>
            <hr />
            <div className="d-flex justify-content-between">
              {" "}
              <p >Dieta sobotnia: </p>
              <Form.Check type='switch' onChange={() => setWeekend(!weekend)}/>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mt-2">Długość pakietu: </p>
              <Form.Control
                disabled={currentVariant ? false : true}
                className="w-50"
                as="select"
                onChange={(e) => setNumberOfDays(e.target.value)}
              >
                <option>Domyślna wartość - 1</option>
                <option value="1">1 dzień</option>
                <option value="5">5 dni</option>
                <option value="10">10 dni</option>
                <option value="20">20 dni</option>
              </Form.Control>
            </div>
          </Col>
        ) : null}
      </Row>
      {currentVariant ? (
        <Col>
          <Row className="m-2 p-2">
            <Col md="12" className="p-2 rounded bg-white ">
              <div className="d-flex justify-content-between">
                <FiMinus
                  size={36}
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                />
                <p className="font-weight-bold m-auto">{quantity}</p>
                <FiPlus size={36} onClick={() => setQuantity(quantity + 1)} />
              </div>
            </Col>
          </Row>
          <Row className="m-2 d-flex justify-content-end">
            <Button
              disabled={currentVariant ? false : true}
              className=" w-25"
              variant="success"
              onClick={() => {
                const values = {
                  diet: !isNaN(+currentVariant.calories)
                    ? currentDiet.find(
                        (item) => item.calories === currentVariant.calories
                      )
                    : currentDiet.find(
                        (item) => item.size === currentVariant.calories
                      ),
                  startDate: startDate,
                  numberOfDays: numberOfDays,
                  quantity: quantity,
                  discount: getDiscount(),
                  weekend: weekend
                };
                setItem(values);
                setSummaryShow(true);
              }}
            >
              Dodaj
            </Button>
          </Row>
        </Col>
      ) : null}

      <SummarySelect show={summaryShow} item={item && item} />
    </Container>
  );
};

export default DietDetails;
