var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("realtors.db");

// select all the realtors, call the callback with them as a parameter
function getAllRealtors(callback) {
  db.all("SELECT rowid, * FROM Realtors",
    function (err, results) { callback(results); });
}

function sortASC(column, callback) {

  const query = 'SELECT rowid, * FROM Realtors ORDER BY ' + column + ' ASC';
  db.all(query,
    function (err, results) {
      if (err) {
        console.error("Database error:", err);
        return;
      }
      callback(results);
    });
}

function sortDESC(column, callback) {
  const query = 'SELECT rowid, * FROM Realtors ORDER BY ' + column + ' DESC';
  db.all(query,
    function (err, results) {
      if (err) {
        console.error("Database error:", err);
        return;
      }
      callback(results);
    });
}

// delete a realtor with a given id
function deleteRealtor(id, callback) {
  db.run("DELETE FROM Realtors WHERE rowid=?", id,
    function (err) { callback(); });
}

// delete any realtor with less than 2 likes
function layoffRealtor(callback) {
  db.run("DELETE FROM Realtors WHERE likes < 2",
    function (err) { callback(); });
}

// insert an realtor into the table
function addRealtor(realtor, callback) {
  db.run("INSERT INTO Realtors VALUES (?,?,?,?)",
    [realtor.firstname, realtor.lastname, realtor.specialties, realtor.likes],
    function (err) { callback(); });
}

// update an realtor with a given id
function updateRealtor(realtor, id, callback) {
  db.run("UPDATE Realtors SET firstname=?,lastname=?,specialties=?, likes=? WHERE rowid=?",
    [realtor.firstname, realtor.lastname, realtor.specialties, realtor.likes, id],
    function (err) { callback(); });
}

//increment like value for given realtor
function likeRealtor(id, callback) {
  db.run("UPDATE Realtors SET likes= likes + 1 WHERE rowid=?",
    [id],
    function (err) { callback(); });
}

// export the functions we have defined
module.exports = { getAllRealtors, sortASC, sortDESC, deleteRealtor, layoffRealtor, addRealtor, updateRealtor, likeRealtor };
