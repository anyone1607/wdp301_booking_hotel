import React, { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import "./side-bar.css";
import { CiBank, CiMap, CiUser, CiViewList, CiLogout } from "react-icons/ci";
import { GrContact } from "react-icons/gr";
import { Image } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthContext"; // Thêm AuthContext

function SideBar() {
  const location = useLocation();
  const { pathname } = location;
  
  // Lấy role người dùng từ AuthContext
  const { user } = useContext(AuthContext);
  const userRole = user?.role;

  return (
    <div className="sidebar" data-color="black" data-active-color="info">
      <div className="logo">
        <Link to="/" className="simple-text logo-normal text-center">
          <Image src={logo} style={{ width: "250px" }} />
        </Link>
      </div>
      <div className="sidebar-wrapper ps">
        <ul className="nav">
          {/* Hiển thị Dashboard chỉ cho admin */}
          {userRole === "admin" && (
            <li className={`${pathname === "/dashboard" ? "active" : ""}`}>
              <Link
                className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}
                to="/dashboard"
                aria-current="page"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <CiBank style={{ fontSize: "24px" }} /> &ensp;
                <p style={{ fontSize: "14px" }}>Dashboard</p>
              </Link>
            </li>
          )}

          {/* Hiển thị các mục cho admin */}
          {userRole === "admin" && (
            <>
              <li className={`${pathname === "/user-management" ? "active" : ""}`}>
                <Link
                  className={`nav-link ${pathname === "/user-management" ? "active" : ""}`}
                  to="/user-management"
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <CiUser style={{ fontSize: "24px" }} />
                  &ensp;
                  <p style={{ fontSize: "14px" }}>Manage Users</p>
                </Link>
              </li>
              <li className={`${pathname === "/tour-management" ? "active" : ""}`}>
                <Link
                  className={`nav-link ${pathname === "/tour-management" ? "active" : ""}`}
                  to="/tour-management"
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <CiMap style={{ fontSize: "24px" }} />
                  &ensp;
                  <p style={{ fontSize: "14px" }}>Manage Tours</p>
                </Link>
              </li>
            </>
          )}

          {/* Hiển thị Manage Bookings cho cả admin và manager */}
          {(userRole === "admin" || userRole === "manager") && (
            <li className={`${pathname === "/booking-management" ? "active" : ""}`}>
              <Link
                className={`nav-link ${pathname === "/booking-management" ? "active" : ""}`}
                to="/booking-management"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <CiViewList style={{ fontSize: "24px" }} />
                &ensp;
                <p style={{ fontSize: "14px" }}>Manage Bookings</p>
              </Link>
            </li>
          )}

          {/* Hiển thị Manage Contacts chỉ cho admin */}
          {userRole === "admin" && (
            <li className={`${pathname === "/contact-management" ? "active" : ""}`}>
              <Link
                className={`nav-link ${pathname === "/contact-management" ? "active" : ""}`}
                to="/contact-management"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <GrContact style={{ fontSize: "24px" }} />  
                &ensp;
                <p style={{ fontSize: "14px" }}>Manage Contacts</p>
              </Link>
            </li>
          )}

          {/* Log out */}
          <li className={`${pathname === "/login" ? "active" : ""}`}>
            <Link
              className={`nav-link ${pathname === "/login" ? "active" : ""}`}
              to="/login"
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <CiLogout style={{ fontSize: "24px" }} />
              &ensp;
              <p style={{ fontSize: "14px" }}>Log out</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
