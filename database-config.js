const sql = require("mssql");
const config = {
  user: 'adminreem',
  password: '13707177@Reem',
  server: 'userver2024.database.windows.net',
  database: 'Shoppingdb008',
  options:{
    encrypt:true //used if you're om windows azure
  }
};
sql.connect(config).catch((error) => console.log(error));
module.exports = sql;