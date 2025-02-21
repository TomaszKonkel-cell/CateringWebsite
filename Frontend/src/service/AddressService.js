import axios from "axios";
import authHeader from "./authHeader";
import ClientService from "./ClientService";
const API_URL = "http://localhost:8080";

const getAddressesForClient = async () => {
  const client = ClientService.getCurrentClient();
  return await axios.get(
    API_URL + `/api/address/getForClient?clientId=${client.id}`,
    { headers: authHeader() }
  );
};

const addAddress = async (id, postData) => {
  return await axios.post(
    API_URL + `/api/address/save?clientId=${id}`,
    postData,
    { headers: authHeader() }
  );
};

const updateAddress = async (id, postData) => {
  return await axios.put(API_URL + `/api/address/update?id=${id}`, postData, {
    headers: authHeader(),
  });
};

const deleteAddress = async (id) => {
  return await axios.delete(API_URL + `/api/address/delete?id=${id}`, {
    headers: authHeader(),
  });
};

const updateAddressForOrder = async (orderId, newOrderAddress) => {
  console.log(newOrderAddress)
  return await axios.put(API_URL + `/api/address/updateOrderAddres?orderId=${orderId}`, newOrderAddress, {
    headers: authHeader(),
  });
};



const AddressService = {
  getAddressesForClient,
  addAddress,
  updateAddress,
  deleteAddress,
  updateAddressForOrder
};

export default AddressService;
