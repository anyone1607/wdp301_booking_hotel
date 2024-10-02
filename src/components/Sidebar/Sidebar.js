import { useLocation, Link } from "react-router-dom";
import "./side-bar.css";
import { CiBank, CiMap, CiUser, CiViewList, CiLogout } from "react-icons/ci";
import { GrContact } from "react-icons/gr";
import { Image } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
function SideBar() {
  const location = useLocation();
  const { pathname } = location;
  return (
    <div className="sidebar" data-color="black" data-active-color="info">
      <div className="logo">
        <Link to="/admin" className="simple-text logo-normal text-center">
          <Image src={logo} style={{ width: "250px" }} />
        </Link>
      </div>
      <div className="sidebar-wrapper ps">
        <ul className="nav">
          <li className={`${pathname === "/admin/dashboard" ? "active" : ""}`}>
            <Link
              className={`nav-link ${pathname === "/admin/dashboard" ? "active" : ""}`}
              to="/admin/dashboard"
              aria-current="page"
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <CiBank style={{ fontSize: "24px" }} /> &ensp;
              <p style={{ fontSize: "14px" }}>Dashboard</p>
            </Link>
          </li>
          <li className={`${pathname === "/admin/user-management" ? "active" : ""}`}>
            <Link
              className={`nav-link ${pathname === "/admin/user-management" ? "active" : ""}`}
              to="/admin/user-management"
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <CiUser style={{ fontSize: "24px" }} />
              &ensp;
              <p style={{ fontSize: "14px" }}>Manage Users</p>
            </Link>
          </li>
          <li className={`${pathname === "/admin/tour-management" ? "active" : ""}`}>
            <Link
              className={`nav-link ${pathname === "/admin/tour-management" ? "active" : ""}`}
              to="/admin/tour-management"
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <CiMap style={{ fontSize: "24px" }} />
              &ensp;
              <p style={{ fontSize: "14px" }}>Manage Tours</p>
            </Link>
          </li>
          <li className={`${pathname === "/admin/booking-management" ? "active" : ""}`}>
            <Link
              className={`nav-link ${pathname === "/admin/booking-management" ? "active" : ""}`}
              to="/admin/booking-management"
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <CiViewList style={{ fontSize: "24px" }} />
              &ensp;
              <p style={{ fontSize: "14px" }}>Manage Bookings</p>
            </Link>
          </li>
          <li className={`${pathname === "/admin/contact-management" ? "active" : ""}`}>
            <Link
              className={`nav-link ${pathname === "/admin/contact-management" ? "active" : ""}`}
              to="/admin/contact-management"
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <GrContact style={{ fontSize: "24px" }} />  
              &ensp;
              <p style={{ fontSize: "14px" }}>Manage Contacts</p>
            </Link>
          </li>
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
