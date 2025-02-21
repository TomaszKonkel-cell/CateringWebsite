import React, { Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ClientService from "./service/ClientService";
import Swal from "sweetalert2";
import secureLocalStorage from "react-secure-storage";

const Home = React.lazy(() => import("./views/Home"));
const Header = React.lazy(() => import("./views/Header"));
const NotAvailable = React.lazy(() => import("./views/NotAvailable"));

const Login = React.lazy(() => import("./views/Client/Login"));
const Register = React.lazy(() => import("./views/Client/Register"));
const VerifyClient = React.lazy(() => import("./views/Client/VerifyClient"));
const VerifyReset = React.lazy(() => import("./views/Client/VerifyReset"));

const ClientAccount = React.lazy(() => import("./views/Client/ClientAccount"));
const DietDetails = React.lazy(() => import("./views/Diet/DietDetails"));
const Order = React.lazy(() => import("./views/Order/Order"));
const OrderDetails = React.lazy(() => import("./views/Order/OrderDetails"));

const App = () => {
  let navigate = useNavigate();

  const client = ClientService.getCurrentClient();
  var now = new Date().getTime();
  if (client != null) {
    if (now - client.loginTime > 3600000) {
      secureLocalStorage.removeItem("client");
      navigate("/login");
      Swal.fire(
        "Sesja wygasła wymagane jest ponowne zalogowanie się",
        "",
        "error"
      );
    }
  }

  return (
    <div
      style={{
        backgroundImage: "url(/background.jpg)",
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        overflowY: "hidden",
      }}
    >
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      />
      <Header />
      <Suspense fallback={<div>Ładowanie...</div>}>
        {client ? (
          <Routes>
            <Route path="*" element={<NotAvailable />} />
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<ClientAccount />} />
            <Route path="/dietDetails" element={<DietDetails />} />
            <Route path="/order" element={<Order />} />
            <Route path="/orderDetails" element={<OrderDetails />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<NotAvailable />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verifyClient" element={<VerifyClient />} />
            <Route path="/resetPassword" element={<VerifyReset />} />
          </Routes>
        )}
      </Suspense>
    </div>
  );
};

export default App;
