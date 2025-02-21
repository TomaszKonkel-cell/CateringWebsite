import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import ClientService from "../service/ClientService";

import Diets from "./Diets";
import Greetings from "./Greetings";

const Home = () => {
  let navigate = useNavigate();
  const [logged, setLogged] = useState(false);


  useEffect(() => {
    const client = ClientService.getCurrentClient();
    if (client) {
      setLogged(true);
    }
  }, []);
  return (
    <>
      {logged ? (
        <Diets />
      ) : (
        <Greetings />
      )}
    </>
  );
};

export default Home;
