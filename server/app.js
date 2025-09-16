import express from "express";
import cookieParser from 'cookie-parser';
const app = express();

import userRouter from "#api/UserRecords";
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).send("Chess API is running...");
});

app.use("/api", userRouter);

export default app;

