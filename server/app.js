import express from "express";
const app = express();

import employeesRouter from "#api/employees";
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Welcome to the Fullstack Employees API.");
});

app.use("/employees", employeesRouter);

export default app;

