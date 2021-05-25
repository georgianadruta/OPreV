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
 * This method returns the hashed version of the password of the user if it exists in the database.
 * @param jsonLoginAccount the account to get the password of
 * @returns {Promise<>} a new promise
 */
const getHashedPasswordOfAdminAccount = function (jsonLoginAccount) {
    return new Promise((resolve, reject) => {
        let con = getConnection({database: "users"})
        const table = "active_admins";

        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");

            } else {
                const sql = "SELECT password FROM " + table + " WHERE name='" + jsonLoginAccount.username + "'";
                con.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log("SELECT failed!")
                        reject("SELECT failed!");
                    } else {
                        if (result.length > 0) {
                            resolve(result[0].password);
                        } else {
                            console.log("User '" + jsonLoginAccount.username + "' does not exist in the database. ");
                            reject("User '" + jsonLoginAccount.username + "' does not exist.");
                        }
                    }
                });
            }
        });
    })
}

/**
 * This method is responsible for adding a registration account to be verified by admins in the the database.
 * @param jsonRegistrationAccount a json of username password and email
 * @returns {Promise<>} a new promise
 */
const addRegistrationUser = function (jsonRegistrationAccount) {
    return new Promise((resolve, reject) => {
        let con = getConnection({database: "users"})
        const table = "registration_requests";

        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");

            } else {
                const sql = "INSERT INTO " + table + '(name,password,email)' + " VALUES ('" + jsonRegistrationAccount.username + "','"
                    + jsonRegistrationAccount.password + "','" + jsonRegistrationAccount.email + "')";

                con.query(sql, function (err) {
                    if (err) {
                        console.log("Failed to add " + jsonRegistrationAccount.username + " to registration requests." + "\nREASON: " + err.sqlMessage);

                        let msg = err.sqlMessage.toString();
                        let duplicateFieldIndex = "";
                        if ((duplicateFieldIndex = msg.indexOf('name')) === -1)
                            duplicateFieldIndex = msg.indexOf('email');

                        let duplicateField = msg.substring(duplicateFieldIndex, msg.indexOf("'", duplicateFieldIndex + 2));
                        reject("Field " + duplicateField + " already exists.Choose another one.");
                    } else {
                        console.log("Added " + jsonRegistrationAccount.username + " to registration requests.");
                        resolve("Added " + jsonRegistrationAccount.username + " to registration requests.");
                    }
                });
            }
        });
    })
}

module.exports.addRegistrationUser = addRegistrationUser;
module.exports.getUserHashedPassword = getHashedPasswordOfAdminAccount;