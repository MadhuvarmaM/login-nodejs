const pool = require("../../config/database");



module.exports = {
    create:(data,callBack)=>{
        pool.query(`insert into login (name,email,password,created_at) values(?,?,?,?)`,[
            data.name,
            data.email,
            data.password,
            data.created_at
        ],
        (error,results)=>{
            if(error){
               return  callBack(error);
            }
            return callBack(null,results);
        }
    )
    }
}