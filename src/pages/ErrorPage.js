import React from "react";
import { Container } from "react-bootstrap";

const ErrorPage = () => {
  return (
    <Container className="text-center mt-5">
     
      <h1>Bạn không có quyền truy cập vào trang này.</h1>
      <img 
        src="https://www.lucushost.com/blog/wp-content/uploads/2020/06/error-403-forbbiden.png" 
        alt="403 Forbidden"
        style={{ maxWidth: '100%', height: '500px' }}
      />
    </Container>
  );
};

export default ErrorPage;
