import React from 'react';
import { useParams } from 'react-router-dom';

const PaymentCancel = () => {
  const { id } = useParams();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    color: '#b43a3a',
    backgroundColor: '#ffe6e6',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: '20px auto',
    border: '1px solid #f5bcbc',
  };

  const headingStyle = {
    fontSize: '2rem',
    marginBottom: '10px',
  };

  const paragraphStyle = {
    fontSize: '1.2rem',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Payment Cancelled</h1>
      <p style={paragraphStyle}>Your booking has not been confirmed.</p>
    </div>
  );
};

export default PaymentCancel;
