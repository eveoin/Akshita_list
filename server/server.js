const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

let count = 0;

app.use(bodyParser.json());
app.use(cors());

app.post('/test', (req, res) => {
  const { Email } = req.body;

  console.log('Received email:', Email);
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    let emails = [];
    if (data) {
      emails = JSON.parse(data);
    }
    emails.push(Email);

    fs.writeFile('data.json', JSON.stringify(emails), (err) => {
      if (err) {
        console.error('Error writing data to file:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
      console.log('Email stored in data.json file');
      res.status(200).send({ message: 'Email received and stored successfully' });
    });
  });
});

app.get('/test', (req, res) => {
  res.status(200).send({ count });
});

app.post('/update-count', (req, res) => {
  const { newCount } = req.body;
  count = newCount;
  res.status(200).send({ message: 'Count updated successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

