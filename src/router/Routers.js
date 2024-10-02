import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/User/Home';
import Tours from '../pages/User/Tours';
import TourDetails from '../pages/User/TourDetails';
import Login from '../pages/User/Login';
import Register from '../pages/User/Register';
import ThankYou from '../pages/User/ThankYou';
import SearchResultList from '../pages/User/SearchResultList';
import AboutPage from '../pages/User/AboutPage';
import CopyrightPage from '../pages/User/CopyrightPage';
import ResetPassword from '../pages/User/ForgetPassWord';
import Profile from '../pages/User/Profile';
import MyBookings from '../pages/User/myBooking';
import Promotion from '../pages/User/Promotion';
import ContactPage from '../pages/User/Contact';
import PaymentSuccess from '../pages/User/Success';
import PaymentCancel from '../pages/User/Cancel';
import DashboardPage from '../pages/admin/DashboardPage';
import UserManagement from '../pages/admin/UserManagement';
import TourManagement from '../pages/admin/TourManagement';
import BookingManagement from '../pages/admin/BookingManagement';
import CreateTour from '../pages/admin/CreateTour';
import UpdateTour from '../pages/admin/UpdateTour';
import ContactManagement from '../pages/admin/ContactMangement';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/Layout/AdminLayout';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

import ErrorPage from '../pages/ErrorPage'; // Nhập trang ErrorPage

const Routers = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user && user.role === 'admin'; // Kiểm tra người dùng có phải admin hay không

    return (
        <>
            {/* Hiển thị Header và Footer chỉ khi người dùng không phải là admin */}
            {!isAdmin && <Header />}
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
<Route path="/tours" element={<Tours />} />
<Route path="/tours/:id" element={<ProtectedRoute element={<TourDetails />} allowedRoles={['user', 'admin']} />} />
<Route path="/thank-you" element={<ProtectedRoute element={<ThankYou />} allowedRoles={['user']} />} />
<Route path="/tours/search" element={<ProtectedRoute element={<SearchResultList />} allowedRoles={['user']} />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/copyright" element={<CopyrightPage />} />
<Route path="/reset-password" element={<ProtectedRoute element={<ResetPassword />} allowedRoles={['user']} />} />
<Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={['user']} />} />
<Route path="/my-booking" element={<ProtectedRoute element={<MyBookings />} allowedRoles={['user']} />} />
<Route path="/contact" element={<ContactPage />} />
<Route path="/deals" element={<ProtectedRoute element={<Promotion />} allowedRoles={['user']} />} />
<Route path="/success" element={<ProtectedRoute element={<PaymentSuccess />} allowedRoles={['user']} />} />
<Route path="/cancel" element={<ProtectedRoute element={<PaymentCancel />} allowedRoles={['user']} />} />

                {/* <Route path="/home" element={<ProtectedRoute element={<Home />} allowedRoles={['user']} />} />
                <Route path="/tours" element={<ProtectedRoute element={<Tours />} allowedRoles={['user']} />} />
                <Route path="/tours/:id" element={<ProtectedRoute element={<TourDetails />} allowedRoles={['user', 'admin']} />} />
                <Route path="/thank-you" element={<ProtectedRoute element={<ThankYou />} allowedRoles={['user']} />} />
                <Route path="/tours/search" element={<ProtectedRoute element={<SearchResultList />} allowedRoles={['user']} />} />
                <Route path="/about" element={<ProtectedRoute element={<AboutPage />} allowedRoles={['user']} />} />
                <Route path="/copyright" element={<ProtectedRoute element={<CopyrightPage />} allowedRoles={['user']} />} />
                <Route path="/reset-password" element={<ProtectedRoute element={<ResetPassword />} allowedRoles={['user']} />} />
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={['user']} />} />
                <Route path="/my-booking" element={<ProtectedRoute element={<MyBookings />} allowedRoles={['user']} />} />
                <Route path="/contact" element={<ProtectedRoute element={<ContactPage />} allowedRoles={['user']} />} />
                <Route path="/deals" element={<ProtectedRoute element={<Promotion />} allowedRoles={['user']} />} />
                <Route path="/success" element={<ProtectedRoute element={<PaymentSuccess />} allowedRoles={['user']} />} />
                <Route path="/cancel" element={<ProtectedRoute element={<PaymentCancel />} allowedRoles={['user']} />} /> */}

                {/* Admin Routes */}
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<ProtectedRoute element={<DashboardPage />} allowedRoles={['admin']} />} />
                    <Route path="/admin/user-management" element={<ProtectedRoute element={<UserManagement />} allowedRoles={['admin']} />} />
                    <Route path="/admin/tour-management" element={<ProtectedRoute element={<TourManagement />} allowedRoles={['admin']} />} />
                    <Route path="/admin/booking-management" element={<ProtectedRoute element={<BookingManagement />} allowedRoles={['admin']} />} />
                    <Route path="/admin/create-tour" element={<ProtectedRoute element={<CreateTour />} allowedRoles={['admin']} />} />
                    <Route path="/admin/update-tour/:id" element={<ProtectedRoute element={<UpdateTour />} allowedRoles={['admin']} />} />
                    <Route path="/admin/contact-management" element={<ProtectedRoute element={<ContactManagement />} allowedRoles={['admin']} />} />
                </Route>

                {/* Route cho trang lỗi */}
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<Navigate to="/error" />} /> {/* Redirect all other routes to ErrorPage */}
            </Routes>
            {/* Hiển thị Footer chỉ khi người dùng không phải là admin */}
            {!isAdmin && <Footer />}
        </>
    );
};

export default Routers;

