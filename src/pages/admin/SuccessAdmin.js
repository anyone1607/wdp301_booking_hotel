import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../utils/config";
import axios from "axios";

const PaymentSuccessAdmin = () => {
  const { bookingId } = useParams(); // Lấy bookingId từ URL
  const [message, setMessage] = useState('Processing your payment...');
  const [booking, setBooking] = useState(null); // Đổi thành null để dễ kiểm tra

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // Lấy thông tin booking theo ID
        const response = await axios.get(`${BASE_URL}/booking/${bookingId}`, { withCredentials: true });
        setBooking(response.data.data); // Cập nhật booking với thông tin từ response
      } catch (error) {
        console.error("Error fetching booking:", error.message);
        setMessage('An error occurred while fetching your booking'); // Thông báo lỗi
      }
    };

    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    const createPayment = async () => {
      if (!booking) return; // Nếu booking chưa được tải, không làm gì cả

      try {
        // Kiểm tra xem payment đã tồn tại chưa
        const paymentResponse = await axios.get(`${BASE_URL}/payment/${bookingId}`);

        // Nếu payment đã tồn tại, không tạo payment mới
        if (paymentResponse.data.data) {
          setMessage('Payment already exists for this booking.');
          return;
        }

        // Nếu chưa tồn tại, tạo payment mới
        await axios.post(`${BASE_URL}/payment`, {
          amount: booking.totalAmount, // Sử dụng tổng tiền từ booking
          bookingId: bookingId,
          status: 'confirmed' // Trạng thái mặc định cho payment
        });

        // Update status booking
        await axios.put(`${BASE_URL}/booking/${bookingId}`, {
          status: 'confirmed'
        });

        setMessage('Payment created successfully. Waiting 24h for staff to confirm your booking.');

      } catch (error) {
        console.error("Error creating payment:", error.message);
        setMessage('An error occurred while creating payment'); // Thông báo lỗi
      }
    };

    createPayment();
  }, [booking]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default PaymentSuccessAdmin;
