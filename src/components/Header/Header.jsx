import React, { useEffect, useRef, useContext } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import "./header.css";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa"; // Import icon profile

const nav__links = [
  { path: "/home", display: "Home" },
  { path: "/location", display: "Location" },
  { path: "/about", display: "About" },
  { path: "/deals", display: "Promotion" },
  { path: "/contact", display: "Contact" },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const stickyHeaderFunc = () => {
    if (headerRef.current) {
      const handleScroll = () => {
        if (
          document.body.scrollTop > 80 ||
          document.documentElement.scrollTop > 80
        ) {
          headerRef.current.classList.add("sticky__header");
        } else {
          headerRef.current.classList.remove("sticky__header");
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  };

  useEffect(() => {
    const cleanup = stickyHeaderFunc();
    return cleanup; // Đảm bảo rằng bạn dọn dẹp event listener khi component bị hủy
  }, []);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle("show__menu");
    }
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            {/* LOGO */}
            <div className="logo">
              <Link to="/home">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>

            {/* MENU */}
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? "active__link" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* NAVIGATION RIGHT */}
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-2">
                {user ? (
                  <FaUserCircle
                    id="profile-icon"
                    size={40} // Kích thước của icon
                    style={{
                      cursor: "pointer",
                      transition: "color 0.3s",
                    }}
                    onClick={() => navigate("/profile")}
                    onMouseEnter={(e) => (e.target.style.color = "#0056b3")} // Thay đổi màu khi hover
                    onMouseLeave={(e) => (e.target.style.color = "#007bff")}
                  />
                ) : (
                  <>
                    <Button className="btn primary__btn">
                      <Link to="/login" className="link-btn">
                        Login
                      </Link>
                    </Button>
                    <Button className="btn primary__btn">
                      <Link to="/register" className="link-btn">
                        Register
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              <span className="mobile__menu" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
