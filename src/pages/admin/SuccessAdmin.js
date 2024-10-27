import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../utils/config";
import axios from "axios";

const PaymentSuccessAdmin = () => {
  const { bookingId } = useParams();
  const [message, setMessage] = useState('Processing your payment...');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/booking/${bookingId}`, { withCredentials: true });
        setBooking(response.data.data);
      } catch (error) {
        console.error("Error fetching booking:", error.message);
        setMessage('An error occurred while fetching your booking');
      }
    };

    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    const createPayment = async () => {
      if (!booking) return;

      console.log("Current booking status before payment:", booking.status); // Log trạng thái hiện tại

      try {
        const paymentResponse = await axios.get(`${BASE_URL}/payment/${bookingId}`);

        if (paymentResponse.data.data) {
          setMessage('Payment already exists for this booking.');
          return;
        }

        await axios.post(`${BASE_URL}/payment`, {
          amount: booking.totalAmount,
          bookingId: bookingId,
          status: 'confirmed'
        });

        if (booking.status === 'pending' || booking.status === 'processing') {
          const updateBookingResponse = await axios.put(`${BASE_URL}/booking/${bookingId}`, {
            status: 'confirmed'
          });

          if (updateBookingResponse.data.success) {
            setMessage('Payment created successfully. Your booking is now confirmed.');
            await axios.post(`${BASE_URL}/email/send-confirmation`, booking);
          } else {
            setMessage('Failed to update booking status.');
          }
        } else {
          setMessage('Booking status is not valid for confirmation.');
        }

      } catch (error) {
        console.error("Error creating payment:", error.message);
        console.error("API error:", error.response ? error.response.data : error.message);
        setMessage('An error occurred while creating payment');
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
