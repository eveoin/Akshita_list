// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const fs = require('fs');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const dataFilePath = 'data.json';

// app.use(bodyParser.json());
// app.use(cors());

// mongoose.connect('mongodb+srv://kigiya2219:<Akshita@123>@akshitadb.nzncfu2.mongodb.net/?retryWrites=true&w=majority&appName=akshitadb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('Error connecting to MongoDB:', err));

// const emailSchema = new mongoose.Schema({
//   email: String,
// });

// const EmailModel = mongoose.model('Email', emailSchema);

// let count = 0;

// if (fs.existsSync(dataFilePath)) {
//   const data = fs.readFileSync(dataFilePath, 'utf8');
//   const jsonData = JSON.parse(data);
//   count = jsonData.count || 0;
// }

// process.on('SIGINT', () => {
//   const jsonData = JSON.stringify({ count });
//   fs.writeFileSync(dataFilePath, jsonData, 'utf8');
//   process.exit();
// });

// app.post('/test', async (req, res) => {
//   const { email } = req.body;

//   if (email) {
//     try {
//       await EmailModel.create({ email });
//       count++;
//       res.json({ success: true, message: 'Email saved successfully' });
//     } catch (error) {
//       console.error('Error saving email:', error);
//       res.status(500).json({ success: false, message: 'Error saving email' });
//     }
//   } else {
//     res.status(400).json({ success: false, message: 'Email is required' });
//   }
// });

// app.get('/test', (req, res) => {
//   res.json({ count });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


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

// Endpoint to receive the email and store it
app.post('/test', (req, res) => {
  const { Email } = req.body;
  if (!Email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  // For simplicity, just push the email to the list
  emailList.push(Email);
  count++;

  // Write data to file
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify({ count, emailList }));
    res.status(200).send({ message: 'Email stored successfully', count });
  } catch (error) {
    console.error('Error writing data:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Endpoint to retrieve the count
app.get('/test', (req, res) => {
  res.status(200).send({ count });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
