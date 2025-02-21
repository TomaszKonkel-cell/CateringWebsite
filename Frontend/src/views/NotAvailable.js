import React from "react";

import { Container } from "react-bootstrap";

const NotAvailable = () => {
  return (
    <Container className="p-4 d-flex flex-column w-50 rounded-3 shadow-lg bg-light">
      <div className="text-center">
        <p className="font-weight-bold">
          Pod danym adresem nic się nie znajduje lub nie jest dotępny dla danego
          stanu zalogowania
        </p>
      </div>
    </Container>
  );
};

export default NotAvailable;
