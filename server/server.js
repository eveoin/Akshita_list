const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;
const dataFilePath = 'data.json';

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

app.post('/test', (req, res) => {
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

app.get('/test', (req, res) => {
  res.status(200).send({ count });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
