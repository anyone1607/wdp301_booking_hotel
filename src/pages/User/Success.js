import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const { id } = useParams();
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const confirmBooking = async () => {
      // Kiểm tra nếu id không hợp lệ
      if (!id) {
        setMessage('<h1>Invalid booking ID</h1>');
        return;
      }

      try {
        // Gọi API để xác nhận đặt chỗ
        const response = await fetch(`http://localhost:8000/api/v1/booking/payment-success/${id}`);

        // Kiểm tra phản hồi từ server
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }

        // Lấy kết quả từ phản hồi
        const result = await response.text();
        setMessage(result);
      } catch (error) {
        console.error("Error confirming booking:", error.message);
        setMessage('<h1>An error occurred while confirming your booking</h1>');
      }
    };

    confirmBooking();
  }, [id]);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default PaymentSuccess;
