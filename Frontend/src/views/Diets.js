import React, { useEffect, useState } from "react";

import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DietService from "../service/DietService";

const Diets = () => {
  let navigate = useNavigate();
  const [diets, setDiets] = useState();

  useEffect(() => {
    DietService.getDiets().then((res) => {
      setDiets(res.data);
    });
  }, []);

  return (
    <Container
      style={{ maxHeight: "90%", overflowY: "auto", scrollbarWidth: "none" }}
    >
      <Row className="justify-content-between">
        {diets &&
          Object.keys(diets)
            // .sort((a, b) => (a[0] < b[0] ? 1 : -1))
            .map((diet, index) => {
              const values = Object.values(diets)[index];
              return (
                <Col
                  md="3"
                  style={{ backgroundColor: "lightgray" }}
                  className="p-3 m-3 d-flex rounded-3 shadow-lg"
                >
                  <Card className="w-100">
                    {" "}
                    <Card.Img
                      variant="top"
                      src="https://img.freepik.com/free-photo/healthy-life-sport-concept-sneakers-with-apples-towel-bottle-water-wooden-background-copy-space_1220-1474.jpg?ga=GA1.1.1562445896.1731079194&semt=ais_hybrid"
                    />
                    <Card.Title>
                      <p className="font-weight-bold m-2">{diet}</p>
                    </Card.Title>
                    <Card.Body>
                      <p className="text-end">
                        {values[0]} -{">"} {values[values.length - 1]}
                      </p>
                      <Button
                        className="w-100 "
                        variant="outline-success"
                        onClick={() => {
                          navigate(`dietDetails?name=${diet}`);
                        }}
                      >
                        Wybierz
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
      </Row>
    </Container>
  );
};

export default Diets;
