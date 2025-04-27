const express = require("express");
const { signup, login, logout, refreshToken } = require("./auth.controller");

const router = express.Router();



const { verifyToken, verifyRole } = require('../../middleware/auth.middleware'); 

router.post("/signup", signup);           
router.post("/login", login);              
router.post("/logout", logout);            
router.post("/refresh-token", refreshToken); 



router.get('/admin-dashboard', verifyToken, verifyRole(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome to the Admin Dashboard!' });
  });
  
  router.get('/user-dashboard', verifyToken, verifyRole(['user', 'admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome to the User Dashboard!' });
  });

module.exports = router;
