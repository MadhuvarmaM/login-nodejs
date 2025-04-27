// get.router.js
const { getUser } = require("./get.controller");
const router = require("express").Router();

router.get("/", getUser);  
module.exports = router;
