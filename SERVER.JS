const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/system-drop', (req, res) => {
  const { contributor, emotion, amount } = req.body;
  const log = {
    timestamp: new Date().toISOString(),
    contributor,
    emotion,
    amount,
    routedTo: process.env.PAYPAL_EMAIL
  };
  fs.appendFile('vault.log', JSON.stringify(log) + '\n', err => {
    if (err) return res.status(500).send('Log failed');
    res.json({ status: 'Logged and routed', log });
  });
});

app.listen(PORT, () => {
  console.log(`System live on port ${PORT}`);
});
