import axios from 'axios';
import React, { useCallback,useEffect, useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [count, setCount] = useState(0);
  const [updatedCount, setUpdatedCount] = useState();

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

  const validateEmail = (email) => {
    const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    return regex.test(email);
  };

  const displayRazorpay = async () => {
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('You are offline...... Failed to load razorpay SDK');
      return;
    }

    const options = {
      key: 'rzp_test_BqwXmtR5v1PWNh',
      currency: 'INR',
      amount: 3900,
      name: 'eveo',
      description: 'Thanks for joining',
      handler: async function (response) {
        const jsonData = {
          Email: email,
        };

        try {
          await axios.post('http://localhost:5000/test', jsonData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          alert('Payment Successfully');
          const storedEmail = localStorage.getItem('userEmail');
          localStorage.setItem('userEmail', email);
          console.log('Stored Email:', storedEmail);
          updateCount();
        } catch (error) {
          console.error('Error:', error);
        }
      },
      prefill: {
        name: 'eveo',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const updateCount = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/test');
      setCount(response.data.count);
      setUpdatedCount(response.data.count);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  }, []);

  useEffect(() => {
    updateCount();
  }, [updateCount]);

  return (
    <div className="App">
      <form action="http://localhost:5000/test" method="get">
        <div className="input-group">
          <label>Enter your mail:</label>
          {!isValidEmail && <p style={{ color: 'red' }}>Invalid email address</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsValidEmail(true);
            }}
          />
          <button type="button" onClick={() => displayRazorpay()}>
            Join Now
          </button>
        </div>
        <div>
          <h2>Waiting List</h2>
          <p id="count">{updatedCount !== null ? updatedCount : count}</p>
        </div>
      </form>
    </div>
  );
}

export default App;



