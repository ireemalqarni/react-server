const sql = require("mssql");
const config = {
  user: 'sa',
  password: 'sa',
  server: 'localhost',
  database: 'Shopping_db',
  options:{
    trustServerCertificate:true
  }
};
sql.connect(config).catch((error) => console.log(error));
module.exports = sql;