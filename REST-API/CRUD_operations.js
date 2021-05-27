/**
 * This methods returns a new connection to mySQL database
 * @param cookie in cookie.database we specify which database to connect to.
 * @return {Connection} a new Connection
 */
function getConnection(cookie) {
    const mysql = require('mysql');
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "parola",
        database: cookie.database
    });
}

/**
 * This function returns the sql query for the operation required by the parameter filter
 * @param filter Exactly one of the fallowing: 'countries', 'sexes', 'BMIIndicators','years','regions'
 * @param database the database
 * @param tableName the name of the table
 * @return {string} the sql query
 */
const getSelectSQLQueryForFilter = function (filter, database, tableName) {
    switch (filter) {
        case 'countries': {
            return "SELECT DISTINCT country as filter FROM " + tableName;
        }
        case 'years': {
            return "SELECT DISTINCT year as filter FROM " + tableName;
        }
        case 'sexes': {
            return "SELECT DISTINCT sexes as filter FROM " + tableName;
        }
        case 'regions': {
            return "SELECT DISTINCT region as filter FROM " + tableName;
        }
        case 'BMIIndicators': {
            return "SELECT table_name as filter FROM information_schema.tables WHERE table_schema ='" + database + "'";
        }
        default: {
            break;
        }
    }
}

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
                con.query(sql, function (err, result) {
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

/**
 * This method clears the whole logged_users table
 * @returns {Promise<>} a new promise
 */
const clearLoggedUsersTable = function () {
    return new Promise((resolve, reject) => {
        let con = getConnection({database: "users"})
        const table = "logged_users";

        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");

            } else {
                const sql = "TRUNCATE TABLE " + table;
                con.query(sql, function (err) {
                    if (err) {
                        reject("Failed to clear table '" + table + "' .REASON:" + err);
                    } else {
                        resolve("Successfully cleared table '" + table + "'.");
                    }
                });
            }
        });
    })
}

/**
 * This method deletes the token from the logged_users table
 * @param jsonToken the token to be deleted
 * @returns {Promise<>} a new promise
 */
const deleteLoggedUserFromTableByToken = function (jsonToken) {
    return new Promise((resolve, reject) => {
        let con = getConnection({database: "users"})
        const table = "logged_users";
        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");

            } else {
                const sql = "DELETE FROM " + table + " WHERE token='" + jsonToken.token + "';";
                con.query(sql, function (err) {
                    if (err) {
                        console.log("Failed to delete " + jsonToken.token + " from logged users." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to delete " + jsonToken.token + " from logged users.");
                    } else {
                        console.log("Deleted " + jsonToken.token + " from logged users.");
                        resolve("Deleted " + jsonToken.token + " from logged users.");
                    }
                });
            }
        });
    })
}

/**
 * This method adds a new token to the logged_users table
 * @param jsonUser the user token with IP as json
 * @returns {Promise<>} a new promise
 */
const addUserToLoggedUsersTable = function (jsonUser) {
    return new Promise((resolve, reject) => {
        let con = getConnection({database: "users"})
        const table = "logged_users";
        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");

            } else {
                const sql = "INSERT INTO " + table + '(token,IP)' + " VALUES ('" + jsonUser.token + "','" + jsonUser.IP + "')";
                con.query(sql, function (err) {
                    if (err) {
                        console.log("Failed to add " + jsonUser.token + " to logged users." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to add " + jsonUser.token + " to logged users.");
                    } else {
                        console.log("Added " + jsonUser.token + " to logged users.");
                        resolve("Added " + jsonUser.token + " to logged users.");
                    }
                });
            }
        });
    })
}

/**
 * This method adds a new token to the contact_messages table
 * @param jsonContactFormulary the user token with IP as json
 * @returns {Promise<>} a new promise
 */
const addContactMessageToContactMessagesTable = function (jsonContactFormulary) {
    return new Promise((resolve, reject) => {
        let con = getConnection({database: "contact"})
        const table = "contact_messages";
        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");
            } else {
                const sql = "INSERT INTO " + table + '(fullName,email,phoneNumber,message)' + " VALUES ('" + jsonContactFormulary.fullName + "','" +
                    jsonContactFormulary.email + "','" + jsonContactFormulary.phoneNumber + "','" + jsonContactFormulary.message + "')";
                con.query(sql, function (err) {
                    if (err) {
                        console.log("Failed to add " + jsonContactFormulary.fullName + "'s message to contact messages table." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to add " + jsonContactFormulary.fullName + "'s message to contact messages table.");
                    } else {
                        console.log("Added " + jsonContactFormulary.fullName + "'s message to contact messages table.");
                        resolve("Added " + jsonContactFormulary.fullName + "'s message to contact messages table.");
                    }
                });
            }
        });
    })
}

/**
 * This method checks if the token exists in the logged users table.
 * @return Promise<> a promise
 * @param token
 */
const selectTokenFromLoggedUsersTable = function (token) {
    return new Promise(async (resolve, reject) => {
        let con = getConnection({database: "users"})
        const table = "logged_users";
        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");
            } else {
                const sql = "SELECT token from " + table + " WHERE token='" + token + "'";
                con.query(sql, function (err, result) {
                    if (err) {
                        console.log("Failed to select " + token + " from logged users." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to select " + token + " from logged users.");
                    } else {
                        if (result.length > 0) {
                            console.log("Found " + token + " in logged users.");
                            resolve(token);
                        } else {
                            console.log("There is no " + token + " in logged users.");
                            resolve("There is no " + token + " in logged users.");
                        }
                    }
                });
            }
        });
    });
}

/**
 * This method is responsible for getting all contact messages from the contact messages table.
 * @return {Promise<>}
 */
const getContactMessagesFromContactMessagesTable = function () {
    return new Promise((resolve, reject) => {
        let con = getConnection({database: "contact"})
        const table = "contact_messages";
        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");
            } else {
                const sql = "SELECT ID,fullName,email,phoneNumber,message FROM " + table;
                con.query(sql, function (err, results, fields) {
                    if (err) {
                        reject("Failed select all from contact messages table.");
                    } else {
                        let jsonArray = [];
                        results.forEach(rowPacketObject => {
                                jsonArray.push(
                                    {
                                        "id": rowPacketObject.ID,
                                        "fullName": rowPacketObject.fullName,
                                        "email": rowPacketObject.email,
                                        "phoneNumber": rowPacketObject.phoneNumber,
                                        "message": rowPacketObject.message,
                                    })
                            }
                        )
                        resolve(jsonArray);
                    }
                });
            }
        });
    })
}

/**
 * This method deletes any record from any table by ID
 * @param database the database
 * @param tableName
 * @param ID the id of which to delete
 * @returns {Promise<>} a new promise
 */
const deleteFromTableByID = function (database, tableName, ID) {
    return new Promise((resolve, reject) => {
        let con = getConnection({database: database})
        const table = tableName;
        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");

            } else {
                const sql = "DELETE FROM " + table + " WHERE id='" + ID + "';";
                con.query(sql, function (err) {
                    if (err) {
                        console.log("Failed to delete " + ID + " from " + table + "." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to delete " + ID + " from " + table + ".");
                    } else {
                        console.log("Deleted " + ID + " from " + table + ".");
                        resolve("Deleted " + ID + " from " + table + ".");
                    }
                });
            }
        });
    })
}

/**
 * This method is responsible for returning all the data from the given database table with the filters specified.
 * @param database the database
 * @param tableName the table
 * @param filters the filters ( by default 1=1 which is always true so no filters)
 */
const getDatasetDataFromTable = function (database, tableName, filters = '1=1') {
    return new Promise(async (resolve, reject) => {
        let con = getConnection({database: database})
        const table = tableName;
        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");
            } else {
                const sql = "SELECT * from " + table + " WHERE " + filters;
                con.query(sql, function (err, results, fields) {
                    if (err) {
                        console.log("Failed to select " + filters + " from " + tableName + "." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to select " + filters + " from " + tableName + ".");
                    } else {
                        if (results.length > 0) {
                            console.log("Found data in " + tableName + ".");
                            let fieldsArray = [];
                            fields.forEach(field => {
                                fieldsArray.push(field.name);
                            })
                            results = {
                                tableColumns: fieldsArray,
                                dataset: JSON.stringify(results),
                            }
                            resolve(results);
                        } else {
                            console.log("There is no " + "data" + " in logged users with filters:" + filters);
                            resolve(null);
                        }
                    }
                });
            }
        });
    });
}

/**
 * This method updates any record from any dataset table by ID
 * @param database the database
 * @param tableName the name of the table
 * @param ID the id of which to update
 * @param newBMI the new BMI
 * @returns {Promise<>} a new promise
 */
const modifyDataInDataset = function (database, tableName, ID, newBMI) {
    return new Promise((resolve, reject) => {
        let con = getConnection({database: database})
        const table = tableName;
        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");

            } else {
                //UPDATE eurostat.obese SET BMI_value='1' WHERE ID=id;
                const sql = "UPDATE " + table + " SET BMI_value='" + newBMI + "' WHERE id='" + ID + "';";
                con.query(sql, function (err) {
                    if (err) {
                        console.log("Failed to update BMI of " + ID + " from " + table + "." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to update BMI of " + ID + " from " + table + ".");
                    } else {
                        console.log("Updated BMI of " + ID + " from " + table + " to " + newBMI + ".");
                        resolve("Updated BMI of " + ID + " from " + table + " to " + newBMI + ".");
                    }
                });
            }
        });
    })
}


/**
 * This method is responsible for returning all the filters from the given database table with the filter specified.
 * @param database the database
 * @param tableName the table
 * @param filter the filter
 */
const getFiltersFromDataset = function (database, tableName, filter) {
    return new Promise(async (resolve, reject) => {
        let con = getConnection({database: database})
        con.connect(function (err) {
            if (err) {
                console.log(err);
                reject("Failed to connect to the database.");
            } else {
                const sql = getSelectSQLQueryForFilter(filter, database, tableName);
                con.query(sql, function (err, results) {
                    if (err) {
                        console.log("Failed to select " + filter + " from " + tableName + "." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to select " + filter + " from " + tableName + ".");
                    } else {
                        if (results.length > 0) {
                            let filtersArray = [];
                            results.forEach(row => {
                                filtersArray.push(row.filter);
                            })
                            resolve(filtersArray);
                        } else {
                            console.log("There is no " + "data" + " in logged users with filters:" + filter);
                            resolve(null);
                        }
                    }
                });
            }
        });
    });
}

module.exports.getFiltersFromDataset = getFiltersFromDataset;
module.exports.modifyDataInDataset = modifyDataInDataset;
module.exports.getDatasetDataFromTable = getDatasetDataFromTable;
module.exports.deleteFromTableByID = deleteFromTableByID;
module.exports.getContactMessagesFromContactMessagesTable = getContactMessagesFromContactMessagesTable;
module.exports.addContactMessageToContactMessagesTable = addContactMessageToContactMessagesTable;
module.exports.selectTokenFromLoggedUsersTable = selectTokenFromLoggedUsersTable;
module.exports.deleteLoggedUserFromTableByToken = deleteLoggedUserFromTableByToken;
module.exports.addUserToLoggedUsersTable = addUserToLoggedUsersTable;
module.exports.clearLoggedUsersTable = clearLoggedUsersTable;
module.exports.addRegistrationUser = addRegistrationUser;
module.exports.getUserHashedPassword = getHashedPasswordOfAdminAccount;