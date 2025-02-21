import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import authHeader from "./authHeader";
import ClientService from "./ClientService";
const API_URL = "http://localhost:8080";

const addToOrder = async (data) => {
  const order = JSON.parse(secureLocalStorage.getItem("order")) || [];

  if (order.length === 0) {
    createNewOrder(data);
  } else {
    var duplicate = findDuplicate(order, data);
    if (!duplicate) {
      addNewItem(order, data);
    }
  }
};

const createNewOrder = (data) => {
  const newOrder = [];
  newOrder.push(data);
  secureLocalStorage.setItem("order", JSON.stringify(newOrder));
};

const findDuplicate = (order, data) => {
  var duplicate = false;
  order.forEach((element) => {
    if (
      element.diet.id === data.diet.id &&
      element.numberOfDays === data.numberOfDays &&
      element.startDate === data.startDate
    ) {
      element.quantity += data.quantity;
      secureLocalStorage.setItem("order", JSON.stringify(order));
      duplicate = true;
    }
  });
  return duplicate;
};

const addNewItem = (order, data) => {
  const newItem = [...order, data];
  secureLocalStorage.setItem("order", JSON.stringify(newItem));
};

const getOrder = () => {
  return JSON.parse(secureLocalStorage.getItem("order")) || [];
};

const decrease = async (item) => {
  const order = JSON.parse(secureLocalStorage.getItem("order"));
  order.find((element) => {
    if (
      JSON.stringify(element) === JSON.stringify(item) &&
      element.quantity > 1
    ) {
      element.quantity -= 1;
    }
  });
  secureLocalStorage.setItem("order", JSON.stringify(order));
  return JSON.parse(secureLocalStorage.getItem("order"));
};

const increase = async (item) => {
  const order = JSON.parse(secureLocalStorage.getItem("order"));
  order.find((element) => {
    if (JSON.stringify(element) === JSON.stringify(item)) {
      element.quantity += 1;
    }
  });
  secureLocalStorage.setItem("order", JSON.stringify(order));

  return JSON.parse(secureLocalStorage.getItem("order"));
};

const deleteItem = async (item) => {
  const order = JSON.parse(secureLocalStorage.getItem("order"));
  const newItems = order.filter(
    (element) => JSON.stringify(element) !== JSON.stringify(item)
  );
  secureLocalStorage.setItem("order", JSON.stringify(newItems));
  return JSON.parse(secureLocalStorage.getItem("order"));
};

const clearOrder = async () => {
  return secureLocalStorage.removeItem("order");
};

const getOrderDetails = async (id) => {
  return await axios.get(API_URL + `/api/order/getById?id=${id}`, {
    headers: authHeader(),
  });
};

const getSummaryOfPrice = async () => {
  const order = JSON.parse(secureLocalStorage.getItem("order")) || [];
  return await axios.post(API_URL + `/api/order/getSummaryOfPrice`, order, {
    headers: authHeader(),
  });
};

const getCompletedDays = (item) => {
  return axios.post(API_URL + `/api/order/sumOfCompletedDays`, item, {
    headers: authHeader(),
  });
};

const postOrder = async (address) => {
  const client = JSON.parse(secureLocalStorage.getItem("client"));
  const order = JSON.parse(secureLocalStorage.getItem("order"));
  const data = {
    client: client,
    address: address,
    listOfItems: order,
  };
  return await axios.post(API_URL + `/api/order/add`, data, {
    headers: authHeader(),
  });
};

const getAllClientOrders = async (page, size) => {
  const client = ClientService.getCurrentClient();
  return await axios.get(
    API_URL +
    `/api/order/getAllClientOrders?clientId=${client.id}&page=${page}&size=${size}`,
    {
      headers: authHeader(),
    }
  );
};

const getDatesToSuspension = async (orderItemId) => {
  return await axios.get(
    API_URL +
    `/api/order/datesToSuspension?orderItemId=${orderItemId}`,
    {
      headers: authHeader(),
    }
  );
};
const suspensionDiet = async (dates, orderItemId) => {
  return await axios.post(
    API_URL +
    `/api/order/suspensionDiet?orderItemId=${orderItemId}`, dates,
    {
      headers: authHeader(),
    }
  );
};


const OrderService = {
  addToOrder,
  getOrder,
  decrease,
  increase,
  deleteItem,
  clearOrder,
  getOrderDetails,
  getSummaryOfPrice,
  getCompletedDays,
  postOrder,
  getAllClientOrders,
  getDatesToSuspension,
  suspensionDiet
};

export default OrderService;
