function getConnection(cookie) {
    const mysql = require('mysql');
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "parola",
        database: cookie.database
    });
}

function addObjectByJsonString(jsonObjectAsString, cookie) {
    let con = getConnection(cookie);
    const table = cookie.databaseTable;
    try {
        con.connect(function (err) {
            if (err) throw err;

            const jsonObject = JSON.parse(jsonObjectAsString);
            const sql = "INSERT INTO " + table + " VALUES (" + jsonObject.id + ",'" + jsonObject.name + "');";

            con.query(sql, function (err, result) {
                if (err) {
                    console.log("Failed to add " + jsonObjectAsString + " to database.");
                    throw err;
                }
                console.log("Added " + jsonObjectAsString + " to database.");
            });
        });
    } catch (error) {
        console.error(error);
    }
}

const deleteObjectByID = function (jsonObjectAsString, cookie) {
    let con = getConnection(cookie);
    const table = cookie.databaseTable;
    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to mysql database.");

            const jsonObject = JSON.parse(jsonObjectAsString);

            const sql = "DELETE FROM ? WHERE";//TODO CHANGE QUERY
            con.query(sql, function (err, result) {
                if (err) {
                    console.log("Failed to delete " + jsonObjectAsString + " from the database.");
                    throw err;
                }
                console.log("Deleted " + jsonObjectAsString + " from the database.");
            });
        });
    } catch (error) {
        console.error(error);
    }
};

const updateObjectByID = function (jsonObjectAsString, cookie) {
    let con = getConnection(cookie);
    const table = cookie.databaseTable;
    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to mysql database.");

            const jsonObject = JSON.parse(jsonObjectAsString);
            const sql = "UPDATE .... SET ... = '...' WHERE .... = '...'";//TODO CHANGE QUERY
            con.query(sql, function (err, result) {
                if (err) {
                    console.log("Failed to add " + jsonObjectAsString + " to database.");
                    throw err;
                }
                console.log("Added " + jsonObjectAsString + " to database.");
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


const addRegistrationUser = function (jsonRegistrationAccount) {
    let con = getConnection({database: "users"})
    const table = "registration_requests";
    try {
        con.connect(function (err) {
            if (err) throw err;
            const sql = "INSERT INTO " + table + '(name,password,email)' + " VALUES ('" + jsonRegistrationAccount.username + "','"
                + jsonRegistrationAccount.password + "','" + jsonRegistrationAccount.email + "')";

            con.query(sql, function (err) {
                if (err) {
                    console.log("Failed to add " + jsonRegistrationAccount.username + " to registration requests.");
                    throw err;
                }
                console.log("Added " + jsonRegistrationAccount.username + " to registration requests.");
                return true;
            });
        });
    } catch (error) {
        console.error(error);
        return false;
    }
}
module.exports.addRegistrationUser = addRegistrationUser;