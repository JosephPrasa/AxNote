const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Routes
const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true,
}));
app.use(express.json());

app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
