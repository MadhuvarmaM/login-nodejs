const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../config/database");

const signup = (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if email is already in use
  const checkEmailQuery = `SELECT * FROM signup WHERE email = ?`;
  pool.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Error hashing password" });
      }

      // Insert user into DB
      const query = `INSERT INTO signup (username, email, password_hash, created_at) VALUES (?, ?, ?, NOW())`;
      pool.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        // Return user creation success
        res.status(201).json({
          message: "User created successfully",
          userId: results.insertId, // Returning the ID of the newly created user
        });
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM signup WHERE email = ?`;
  pool.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Compare password
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT access token
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
      );

      // Store refresh token in DB
      const storeTokenQuery = `INSERT INTO refresh_token (user_id, token) VALUES (?, ?)`;
      pool.query(storeTokenQuery, [user.id, refreshToken], (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error storing refresh token",err });
        }

        // Set HttpOnly cookie with refresh token
        // res.cookie("refreshToken", refreshToken, {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production",
        //   maxAge: 7 * 24 * 60 * 60 * 1000,
        // });

        return res.status(200).json({ accessToken,refreshToken, role: user.role,  });
      });
    });
  });
};

const refreshToken = (req, res) => {
  // const { refreshToken } = req.cookies;
  const refreshToken = req.body;




  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token required" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    return res.status(200).json({ accessToken,refreshToken:newRefreshToken });
  });
};

const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
};
