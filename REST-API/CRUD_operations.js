const mysql = require('mysql');

function getConnection(cookie) {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "parola",
        database: cookie.database
    });
}

function addObjectByJsonString(jsonObjectString, cookie) {
    let con = getConnection(cookie);
    const table = cookie.databaseTable;
    try {
        con.connect(function (err) {
            if (err) throw err;

            const jsonObject = JSON.parse(jsonObjectString);
            const sql = "INSERT INTO " + table + " VALUES (" + jsonObject.id + ",'" + jsonObject.name + "');";

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

const deleteObjectByID = function (jsonObjectString, cookie) {
    let con = getConnection(cookie);
    const table = cookie.databaseTable;
    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to mysql database.");

            const jsonObject = JSON.parse(jsonObjectString);

            const sql = "DELETE FROM ? WHERE";//TODO CHANGE QUERY
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

const updateObjectByID = function (jsonObjectString, cookie) {
    let con = getConnection(cookie);
    const table = cookie.databaseTable;
    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to mysql database.");

            const jsonObject = JSON.parse(jsonObjectString);
            const sql = "UPDATE .... SET ... = '...' WHERE .... = '...'";//TODO CHANGE QUERY
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

/**
 * TODO WHOLE FUNCTION
 * @param selectFields
 * @param whereClause
 */
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

addObjectByJsonString('{"id":5, "name":"John"}', {"database": "test", "databaseTable": "testtable"});

