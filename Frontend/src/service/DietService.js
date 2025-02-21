import axios from "axios";
import authHeader from "./authHeader";
const API_URL = "http://localhost:8080";

const getDiets = async () => {
  return await axios.get(API_URL + `/api/diet/getOrdered`,  {
    headers: authHeader(),
  });
};

const getDietByName = async (name) => {
  return await axios.get(API_URL + `/api/diet/getByName?name=${name}`,  {
    headers: authHeader(),
  });
};


const DietService = {
  getDiets,
  getDietByName
};

export default DietService;
