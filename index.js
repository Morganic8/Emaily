const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send({ server: 'serving data...' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
