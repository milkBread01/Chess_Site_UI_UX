import express from "express";
const app = express();

import userRouter from "#api/UserRecords";
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Chess API is running...");
});

app.use("/api", userRouter);

export default app;

