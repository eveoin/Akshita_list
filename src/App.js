import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleClick = () => {
    setCount(count + 1);
  };

  const validateEmail = (email) => {
    const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    return regex.test(email);
  };

  const displayRazorpay = async () => {
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    setIsValidEmail(true);

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('You are offline...... Failed to load razorpay SDK');
      return;
    }

    const options = {
      key: 'rzp_test_BqwXmtR5v1PWNh',
      currency: 'INR',
      amount: 10000,
      name: 'eveo',
      description: 'Thanks for joining',
      handler: function (response) {
        alert('Payment Successfully');
        handleClick(); 
      },
      prefill: {
        name: 'eveo',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="App">
      <div className="input-group">
        <label>Enter your mail:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsValidEmail(true);
          }}
        />
        {!isValidEmail && <p style={{ color: 'red' }}>Invalid email address</p>}
        <button type="button" onClick={() => displayRazorpay()}>
          Join Now
        </button>
      </div>
      <div>
        <h2>Waiting List</h2>
        <button><ul>{count}</ul></button>
      </div>
    </div>
  );
}

export default App;
