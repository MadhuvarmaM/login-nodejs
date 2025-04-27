const router = require("express").Router();
const { createUser } = require("./users.controller");

router.post("/", createUser);




module.exports = router;
