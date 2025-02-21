import secureLocalStorage from "react-secure-storage";
export default function authHeader() {
    const client = JSON.parse(secureLocalStorage.getItem('client'));
    if (client && client.token) {
      return { Authorization: 'Bearer ' + client.token };
    } else {
      return {};
    }
  }