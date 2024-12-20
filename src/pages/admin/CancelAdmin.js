import React from 'react';
import { useParams } from 'react-router-dom';

const PaymentCancelAdmin = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Payment cancelled</h1>
      <p>Your booking has not been confirmed.</p>
    </div>
  );
};

export default PaymentCancelAdmin;
