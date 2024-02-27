// You can use this file to create your realtors database and populate it
// with some initial data.  You can run it with: node initdb.js

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("realtors.db");

db.serialize(function() {

  // create realtors table
  db.run("DROP TABLE IF EXISTS Realtors");
  db.run("CREATE TABLE Realtors (firstname TEXT, lastname TEXT, specialties TEXT, likes INTEGER)");

  // insert records into the realtors table
  db.run("INSERT INTO Realtors VALUES (?,?,?,?)", ['Kevin','Browne','condos', 0]);
  db.run("INSERT INTO Realtors VALUES (?,?,?,?)", ['Mary','Yendt','retirement living', 0]);
  db.run("INSERT INTO Realtors VALUES (?,?,?,?)", ['Michael','Jordan','luxury townhouses', 0]);
  db.run("INSERT INTO Realtors VALUES (?,?,?,?)", ['Sharon','Fuller','urban living', 0]);
  db.run("INSERT INTO Realtors VALUES (?,?,?,?)", ['Ajit','Singh','suburban living', 0]);

});
