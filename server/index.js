require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));

// serve the built React app when it exists (single-server deploys);
// on API-only hosts like Render the frontend lives on Netlify instead
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(path.join(clientDist, 'index.html'))) {
  app.use(express.static(clientDist));
  app.get(/.*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
} else {
  app.get('/', (req, res) => res.json({ status: 'ok', message: 'Myntra clone API' }));
}

// Express 5 forwards rejected promises from async handlers here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
