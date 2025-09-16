import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true, // This is crucial for cookies to work
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware BEFORE other middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Log CORS configuration for debugging
console.log('CORS enabled for origin:', process.env.CORS_ORIGIN || 'http://localhost:5173');

import userRouter from "#api/UserRecords";

app.get("/", (req, res) => {
    res.status(200).send("Chess API is running...");
});

app.use("/api", userRouter);

export default app;