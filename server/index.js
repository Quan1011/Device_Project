import express from "express";
import mysql from "mysql2"
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./routes/auth.js"
import deviceRoutes from './routes/deviceRoutes.js';
import configRoutes from './routes/configRoutes.js';

/* MONGOOSE SETUP */

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });

// // Connect to the database
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to MySQL!');
// });

// configuration

const app = express()
const port = 3000;

app.use(cors())
app.use(bodyParser.json())
app.use(express.json())

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api', deviceRoutes);
app.use('/api', configRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});




