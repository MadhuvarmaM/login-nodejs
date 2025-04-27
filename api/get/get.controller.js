


const { get } = require("./get.service");

module.exports = {
  getUsers: (req, res) => {
    get((error, results) => {
      if (error) {
        // Return an error response
        return res.status(500).json({
          success: 0,
          message: "Error fetching users",
        });
      }
      // Return success response
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
};
