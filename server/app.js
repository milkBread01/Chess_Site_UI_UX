import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true, // This is crucial for cookies to work
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// CORS middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

import userRouter from "#api/UserRecords";

app.get("/", (req, res) => {
    res.status(200).send("Chess API is running...");
});

app.use("/api", userRouter);

export default app;