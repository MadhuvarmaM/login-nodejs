const jwt = require("jsonwebtoken");

const getDashboardData = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Example protected data
    const dashboardData = {
      message: "Welcome to your dashboard!",
      userId: decoded.userId,
      role: decoded.role || "user",
      stats: {
        projects: 5,
        tasksCompleted: 42,
        lastLogin: new Date().toISOString(),
      },
    };

    return res.status(200).json(dashboardData);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  getDashboardData,
};
