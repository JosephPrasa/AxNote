const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');

dotenv.config();

const app = express();


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());


connectDB();


app.use('/api/notes', noteRoutes);
app.use('/api/users', require('./routes/userRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
