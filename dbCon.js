var mysql = require("mysql");
var connection=null;
function setCon() {
    connection =  mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "segwitz",
  })
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
}
function getCon(){
    return connection;
}
module.exports.setCon = setCon;
module.exports.getCon = getCon;