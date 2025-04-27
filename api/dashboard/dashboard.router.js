// api/dashboard/dashboard.router.js
const express = require("express");
const { getDashboardData } = require("./dashboard.controller");

const router = express.Router();

router.get("/", getDashboardData);

module.exports = router;


