import { useNavigate } from "react-router-dom";

import { Col, Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

import { Button } from "react-bootstrap";
import { MdAccountBox, MdShoppingCart } from "react-icons/md";
import ClientService from "../service/ClientService";

const Header = () => {
  let navigate = useNavigate();
  const logged = ClientService.getCurrentClient();

  const logout = () => {
    ClientService.logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <Navbar key={false} expand={false}>
        <Container fluid>
          <Navbar.Brand
            href="/"
            className="m-3 me-auto text-white"
            style={{ fontSize: 24 }}
          >
            CateringApp
          </Navbar.Brand>

          {logged != null ? (
            <Col className="d-flex justify-content-end">
              <Nav.Link href="/order">
                <MdShoppingCart
                  size={26}
                  className="m-2 text-white font-weight-bold"
                />
              </Nav.Link>

              <Navbar.Toggle className="bg-white ml-3" />
            </Col>
          ) : (
            <Nav className="d-flex flex-row">
              <Nav.Link
                href="/login"
                className="mr-3 text-white font-weight-bold"
              >
                Login
              </Nav.Link>
            </Nav>
          )}

          <Navbar.Offcanvas
            style={{
              backgroundImage: "url(/sidebar.jpg)",
              height: "100vh",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Offcanvas.Header
              closeButton
              style={{
                borderColor: "white",
                borderWidth: 1,
                borderBottomRightRadius: 15,
                backgroundColor: "white",
              }}
            >
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}>
                {logged?.username}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link
                  href="/account"
                  className="text-center mb-3"
                  style={{
                    borderColor: "white",
                    borderWidth: 1,
                    borderRadius: 15,
                    backgroundColor: "white",
                  }}
                >
                  <MdAccountBox className="mr-1" size={32} />
                  Konto
                </Nav.Link>
                <Nav.Link
                  href="/order"
                  className="text-center"
                  style={{
                    borderColor: "white",
                    borderWidth: 1,
                    borderRadius: 15,
                    backgroundColor: "white",
                  }}
                >
                  <MdShoppingCart className="mr-1" size={32} />
                  Zamów
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
            <div className="position-absolute, bottom-0, w-100, p-2">
              <Button className="w-100" variant="danger" onClick={logout}>
                Wyloguj
              </Button>
            </div>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};
export default Header;
