const pool = require("../../config/database");

module.exports = {
  get: (callBack) => {
    pool.query(`select * from login`, (error, results) => {
      if (error) {
        return callBack(error);
      }
      return callBack(results);
    });
  }
};
