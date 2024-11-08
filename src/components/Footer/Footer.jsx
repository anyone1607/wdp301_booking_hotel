import React from "react";
import "./footer.css";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const quick__links = [
  { path: "/home", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/tours", display: "Tours" },
  { path: "/copyright", display: "Copyright" },
];

const quick__links2 = [
  { path: "/gallery", display: "Gallery" },
  { path: "/login", display: "Login" },
  { path: "/register", display: "Register" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3">
            <div className="logo">
              <img src={logo} alt="Logo" />
              <p className="footer__slogan">Discover, Experience, Wander</p>
              <p className="footer__slogan">Your Gateway to Adventure!</p>
              <div className="social__link d-flex align-items-center gap-3">
                <Link to="#">
                  <i className="ri-youtube-line"></i>
                </Link>
                <Link to="#">
                  <i className="ri-github-fill"></i>
                </Link>
                <Link to="#">
                  <i className="ri-facebook-circle-line"></i>
                </Link>
                <Link to="#">
                  <i className="ri-instagram-line"></i>
                </Link>
              </div>
            </div>
          </Col>

          <Col lg="3">
            <h5 className="footer__link-title">Discover</h5>
            <ListGroup className="footer__quick-links">
              {quick__links.map((item, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>

          <Col lg="3">
            <h5 className="footer__link-title">Quick Links</h5>
            <ListGroup className="footer__quick-links">
              {quick__links2.map((item, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>

          <Col lg="3">
            <h5 className="footer__link-title">Contact</h5>
            <ListGroup className="footer__quick-links">
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                <span><i className="ri-map-pin-line"></i></span>
                <p>Đại Học FPT - Hà Nội</p>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                <span><i className="ri-mail-line"></i></span>
                <p className="mb-0">Chungnkhe160935@fpt.edu.vn</p>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                <span><i className="ri-phone-fill"></i></span>
                <p className="mb-0">+84 96.189.10 J Q K</p>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
        <div className="footer__bottom text-center mt-4">
          <p>&copy; {year} All rights reserved. Your Company Name.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
