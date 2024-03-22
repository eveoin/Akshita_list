const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const dataFilePath = 'data.json';
const secretKey = '5A4w6FEOawtSdh3z3OiONCpo99HdCHCHsT4v2gomgRw='; 

let count = 0;
let emailList = [];

try {
  const data = fs.readFileSync(dataFilePath);
  const jsonData = JSON.parse(data);
  count = jsonData.count || 0;
  emailList = jsonData.emailList || [];
} catch (error) {
  console.error('Error loading data:', error);
}

app.use(bodyParser.json());
app.use(cors());

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const userId = 1; 
  const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
  res.status(200).send({ token });
});

app.post('/test', verifyToken, (req, res) => {
  const { Email } = req.body;
  if (!Email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  emailList.push(Email);
  count++;

  try {
    fs.writeFileSync(dataFilePath, JSON.stringify({ count, emailList }));
    res.status(200).send({ message: 'Email stored successfully', count });
  } catch (error) {
    console.error('Error writing data:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/test', verifyToken, (req, res) => {
  res.status(200).send({ count });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
