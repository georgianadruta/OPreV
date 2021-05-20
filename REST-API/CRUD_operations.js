const mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "parola",
    database: "test"
});

const table = "test"

/**
 * this function changes the connection to the specified database
 * @param database the database
 */
function changeConnectionDatabase(database) {
    con.database = database;
}

const addObjectByJsonString = function (jsonObjectString) {
    try {
        con.connect(function (err) {
            if (err) throw err;

            const jsonObject = JSON.parse(jsonObjectString);
            const sql = "INSERT INTO" + table + "VALUES (" + jsonObject.id + ",'" + jsonObject.name + "');";

            con.query(sql, function (err, result) {
                if (err) {
                    console.log("Failed to add " + jsonObjectString + " to database.");
                    throw err;
                }
                console.log("Added " + jsonObjectString + " to database.");
            });
        });
    } catch (error) {
        console.error(error);
    }
};

const deleteObjectByID = function (jsonObjectString) {
    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to mysql database.");

            const jsonObject = JSON.parse(jsonObjectString);

            const sql = "DELETE FROM ? WHERE";
            con.query(sql, function (err, result) {
                if (err) {
                    console.log("Failed to delete " + jsonObjectString + " from the database.");
                    throw err;
                }
                console.log("Deleted " + jsonObjectString + " from the database.");
            });
        });
    } catch (error) {
        console.error(error);
    }
};

const updateObjectByID = function (jsonObjectString) {
    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to mysql database.");

            const jsonObject = JSON.parse(jsonObjectString);
            const sql = "UPDATE .... SET ... = '...' WHERE .... = '...'";
            con.query(sql, function (err, result) {
                if (err) {
                    console.log("Failed to add " + jsonObjectString + " to database.");
                    throw err;
                }
                console.log("Added " + jsonObjectString + " to database.");
            });
        });
    } catch (error) {
        console.error(error);
    }
};

const selectFromDatabase = function (selectFields = "*", whereClause = null) {
    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to mysql database.");
            con.query("SELECT " + selectFields + " FROM " + table + whereClause + ";", function (err, result, fields) {
                if (err) {
                    console.log("Failed to select '" + selectFields + "'" + "with clause: " + whereClause + " from database " + con.database + ".");
                    throw err;
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
}

// ``addObjectByJsonString('{"id":3, "name":"John"}');``

module.exports.changeConnectionDatabase = changeConnectionDatabase;