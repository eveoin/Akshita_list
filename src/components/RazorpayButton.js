import React from 'react';
import Razorpay from 'react-razorpay';

const PaymentForm = () => {
  const options = {
    key: 'rzp_test_BqwXmtR5v1PWNh', // Use your test key here
    amount: 10000, // Amount in paise
    currency: 'INR',
    name: 'Your Company Name',
    description: 'Test payment',
    image: 'your_logo_url.png',
    order_id: 'your_order_id', // This can be generated on the server
    handler: (response) => {
      console.log(response);
      alert('Payment successful!');
    },
    prefill: {
      name: 'John Doe',
      email: 'john@example.com',
      contact: '9876543210',
    },
    notes: {
      address: 'Your Company Address',
    },
    theme: {
      color: '#F37254',
    },
  };

  return (
    <Razorpay
      options={options}
      name="Your Company Name"
      description="Test payment"
      image="your_logo_url.png"
    >
      <button>Pay Now</button>
    </Razorpay>
  );
};

export default PaymentForm;