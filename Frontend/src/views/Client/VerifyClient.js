import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Container, Button } from "react-bootstrap";

import { GrStatusGood } from "react-icons/gr";
import { MdOutlineErrorOutline } from "react-icons/md";

import ClientService from "../../service/ClientService";


const VerifyClient = () => {
  const [status, setStatus] = useState(false);
  const [error, setError] = useState(false);

  let navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    ClientService.verify(token).then(
      (res) => {
        setStatus(true);
      },
      (error) => {
        setError(error.response.data)
      }
    );
  }, []);

  return (
    <Container
      style={{ backgroundColor: "lightgray" }}
      className="p-3 my-5 d-flex flex-column w-25 border border-1 rounded-3 shadow-lg"
    >
      {status ? (
        <div className="text-center">
          <p style={{ fontSize: 24, fontWeight: "bold" }}>
            Weryfikacja przebiegła pomyślnie
          </p>
          <GrStatusGood size={64} color="green" />
        </div>
      ) : (
        <div className="text-center">
          <p style={{ fontSize: 24, fontWeight: "bold" }}>
            {error}
          </p>
          <MdOutlineErrorOutline size={64} color="red" />
        </div>
      )}

      <Button
        className="mt-4 font-weight-bold"
        onClick={() => navigate("/login")}
      >
        Powrót
      </Button>
    </Container>
  );
};

export default VerifyClient;
