require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./api/users/users.router");
// const getTable  =require("./api/get/get.router");

const dashboardRouter = require("./api/dashboard/dashboard.router");
const authRouter = require("./api/auth/auth.router");

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
// app.use("/api/getTable", getTable);
app.use("/api/users", userRouter);

app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth", authRouter);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port:`, process.env.APP_PORT);
});

module.exports = app;
