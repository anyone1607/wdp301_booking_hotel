import React, { useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "./side-bar.css";
import { CiBank, CiMap, CiUser, CiViewList, CiLogout } from "react-icons/ci";
import { GrContact } from "react-icons/gr";
import { Image } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthContext"; // Thêm AuthContext

function SideBar() {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate(); // Khai báo navigate

  // Lấy role người dùng từ AuthContext
  const { user, setUser } = useContext(AuthContext); // Thêm setUser để cập nhật context
  const userRole = user?.role;

  const handleLogout = () => {
    // Xóa thông tin người dùng và token
    localStorage.removeItem("accessToken");
    setUser(null); // Cập nhật context để xóa thông tin người dùng
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

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
                className={`nav-link ${pathname === "/dashboard" ? "active" : ""
                  }`}
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
              <li
                className={`${pathname === "/user-management" ? "active" : ""}`}
              >
                <Link
                  className={`nav-link ${pathname === "/user-management" ? "active" : ""
                    }`}
                  to="/user-management"
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <CiUser style={{ fontSize: "24px" }} />
                  &ensp;
                  <p style={{ fontSize: "14px" }}>Manage Users</p>
                </Link>
              </li>
              <li
                className={`${pathname === "/hotel-management" ? "active" : ""}`}
              >
                <Link
                  className={`nav-link ${pathname === "/hotel-management" ? "active" : ""
                    }`}
                  to="/hotel-management"
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <CiMap style={{ fontSize: "24px" }} />
                  &ensp;
                  <p style={{ fontSize: "14px" }}>Manage Hotels</p>
                </Link>
              </li>
            </>
          )}

          {/* Hiển thị Manage Bookings cho cả admin và staff */}
          {(userRole === "admin" || userRole === "staff") && (
            <li
              className={`${pathname === "/booking-management" ? "active" : ""
                }`}
            >
              <Link
                className={`nav-link ${pathname === "/booking-management" ? "active" : ""
                  }`}
                to="/booking-management"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <CiViewList style={{ fontSize: "24px" }} />
                &ensp;
                <p style={{ fontSize: "14px" }}>Manage Bookings</p>
              </Link>
            </li>
          )}

          {/* Hiển thị Manage Contacts chỉ cho admin và staff */}
          {(userRole === "admin" || userRole === "staff") && (
            <li
              className={`${pathname === "/contact-management" ? "active" : ""
                }`}
            >
              <Link
                className={`nav-link ${pathname === "/contact-management" ? "active" : ""
                  }`}
                to="/contact-management"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <GrContact style={{ fontSize: "24px" }} />
                &ensp;
                <p style={{ fontSize: "14px" }}>Reply Contacts</p>
              </Link>
            </li>
          )}

          {/* Hiển thị Manage Locations chỉ cho admin */}
          {userRole === "admin" && (
            <li
              className={`${pathname === "/location-management" ? "active" : ""
                }`}
            >
              <Link
                className={`nav-link ${pathname === "/location-management" ? "active" : ""
                  }`}
                to="/location-management"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <GrContact style={{ fontSize: "24px" }} />
                &ensp;
                <p style={{ fontSize: "14px" }}>Manage Locations</p>
              </Link>
            </li>
          )}

          {/* Hiển thị Manage Room chỉ cho admin */}
          {userRole === "admin" && (
            <li
              className={`${pathname === "/room-management" ? "active" : ""}`}
            >
              <Link
                className={`nav-link ${pathname === "/room-management" ? "active" : ""
                  }`}
                to="/room-management"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <GrContact style={{ fontSize: "24px" }} />
                &ensp;
                <p style={{ fontSize: "14px" }}>Manage Room</p>
              </Link>
            </li>
          )}

          {/* Hiển thị Manage Extrafees chỉ cho admin */}
          {userRole === "admin" && (
            <li
              className={`${pathname === "/extrafees-management" ? "active" : ""}`}
            >
              <Link
                className={`nav-link ${pathname === "/extrafees-management" ? "active" : ""
                  }`}
                to="/extrafees-management"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <GrContact style={{ fontSize: "24px" }} />
                &ensp;
                <p style={{ fontSize: "14px" }}>Manage Extrafees</p>
              </Link>
            </li>
          )}

          {/* Log out */}
          <li className={`${pathname === "/login" ? "active" : ""}`}>
            <Link
              className={`nav-link ${pathname === "/login" ? "active" : ""}`}
              onClick={handleLogout} // Gọi handleLogout khi nhấn vào
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
