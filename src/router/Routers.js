import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../pages/User/Home";
import Tours from "../pages/User/Tours";
import TourDetails from "../pages/User/TourDetails";
import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import ThankYou from "../pages/User/ThankYou";
import SearchResultList from "../pages/User/SearchResultList";
import AboutPage from "../pages/User/AboutPage";
import CopyrightPage from "../pages/User/CopyrightPage";
import ResetPassword from "../pages/User/ForgetPassWord";
import Profile from "../pages/User/Profile";
import MyBookings from "../pages/User/myBooking";
import Promotion from "../pages/User/Promotion";
import ContactPage from "../pages/User/Contact";
import PaymentSuccess from "../pages/User/Success";
import PaymentCancel from "../pages/User/Cancel";
import DashboardPage from "../pages/admin/DashboardPage";
import UserManagement from "../pages/admin/UserManagement";
import TourManagement from "../pages/admin/TourManagement";
import BookingManagement from "../pages/admin/BookingManagement";
import CreateTour from "../pages/admin/CreateTour";
import UpdateTour from "../pages/admin/UpdateTour";
import ContactManagement from "../pages/admin/ContactMangement";
import LocationManagement from "../pages/admin/LocationsManagement"; // Import trang quản lý địa điểm
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "../context/AuthContext";
import AdminLayout from "../components/Layout/AdminLayout";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ErrorPage from "../pages/ErrorPage"; // Nhập trang ErrorPage

const Routers = () => {
  const { user } = useContext(AuthContext);
  const isAdminOrManager =
    user && (user.role === "admin" || user.role === "manager"); // Kiểm tra người dùng là admin hoặc manager

  // Sử dụng useLocation để lấy đường dẫn hiện tại
  const location = useLocation();

  // Kiểm tra xem đường dẫn có bắt đầu bằng '/dashboard' hoặc các route quản lý không
  const hideHeaderFooter =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/user-management") ||
    location.pathname.startsWith("/tour-management") ||
    location.pathname.startsWith("/booking-management") ||
    location.pathname.startsWith("/create-tour") ||
    location.pathname.startsWith("/update-tour") ||
    location.pathname.startsWith("/contact-management") ||
    location.pathname.startsWith("/location-management"); // Kiểm tra cả route của LocationManagement

  return (
    <>
      {/* Chỉ hiển thị Header và Footer khi không ở các trang admin */}
      {!hideHeaderFooter && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetails />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/tours/search" element={<SearchResultList />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/copyright" element={<CopyrightPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-booking" element={<MyBookings />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/deals" element={<Promotion />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />

        {/* Admin & Manager Routes */}
        <Route element={<AdminLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                element={<DashboardPage />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute
                element={<UserManagement />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/tour-management"
            element={
              <ProtectedRoute
                element={<TourManagement />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/booking-management"
            element={
              <ProtectedRoute
                element={<BookingManagement />}
                allowedRoles={["admin", "manager"]}
              />
            }
          />
          <Route
            path="/create-tour"
            element={
              <ProtectedRoute
                element={<CreateTour />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/update-tour/:id"
            element={
              <ProtectedRoute
                element={<UpdateTour />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/contact-management"
            element={
              <ProtectedRoute
                element={<ContactManagement />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/location-management"
            element={
              <ProtectedRoute
                element={<LocationManagement />}
                allowedRoles={["admin"]}
              />
            }
          />
        </Route>

        {/* Route cho trang lỗi */}
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/error" />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default Routers;
