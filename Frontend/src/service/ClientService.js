import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import authHeader from "./authHeader";
const API_URL = "http://localhost:8080";

const register = async (postData) => {
  return await axios.post(API_URL + "/api/client/register", postData);
};

const login = async (postData) => {
  const response = await axios.post(API_URL + "/api/client/login", postData);

  if (response.data.token) {
    secureLocalStorage.setItem("client", JSON.stringify(response.data));
  }
};

const verify = async (token) => {
  return await axios.get(
    API_URL + `/api/client/verificateClient?token=${token}`
  );
};

const verifyReset = async (clientId, newPassword) => {
  return await axios.get(
    API_URL + `/api/client/verificateReset?id=${clientId}&newPassword=${newPassword}`
  );
};

const updateClient = async (id, postData) => {
  return await axios.put(API_URL + `/api/client/update?id=${id}`, postData,  {
    headers: authHeader(),
  });
};

const updateClientPass = async (id, newPass, oldPass) => {
  return await axios.put(API_URL + `/api/client/updatePass?id=${id}&newPass=${newPass}&oldPass=${oldPass}`, null,  {
    headers: authHeader(),
  });
};

const resetPassword = async (email) => {
  return await axios.post(API_URL + `/api/client/reset?email=${email}`);
};

const logout = () => {
  secureLocalStorage.removeItem("client");
};

const getCurrentClient = () => {
  return JSON.parse(secureLocalStorage.getItem("client"));
};


const ClientService = {
  register,
  login,
  verify,
  verifyReset,
  updateClient,
  updateClientPass,
  resetPassword,
  logout,
  getCurrentClient,
};

export default ClientService;
