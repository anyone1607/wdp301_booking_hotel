import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../utils/config";
import axios from "axios";

const PaymentSuccess = () => {
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
        setMessage('<h1>An error occurred while fetching your booking</h1>'); // Thông báo lỗi
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
          setMessage('<h1>Payment already exists for this booking.</h1>');
          return;
        }

        // Nếu chưa tồn tại, tạo payment mới
        const newPaymentResponse = await axios.post(`${BASE_URL}/payment`, {
          amount: booking.totalAmount, // Sử dụng tổng tiền từ booking
          bookingId: bookingId,
          status: 'confirmed' // Trạng thái mặc định cho payment
        });

        setMessage('<h1>Payment created successfully. Waiting 24h to confirm booking by staff.</h1>');

      } catch (error) {
        console.error("Error creating payment:", error.message);
        setMessage('<h1>An error occurred while creating payment</h1>'); // Thông báo lỗi
      }
    };

    createPayment();
  }, [booking]);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default PaymentSuccess;
