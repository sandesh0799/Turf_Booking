const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config()
const app = express();
const authRoutes = require('./routes/auth');
// Middleware
app.use(cors({
    origin: 'http://localhost:4300',
    credentials: true,
}));
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("db connected"))
    .then((err) => {
        err;
    });
// Port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
