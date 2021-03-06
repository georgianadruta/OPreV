/**
 * This methods returns a new connection to mySQL database
 * @param cookie in cookie.database we specify which database to connect to.
 * @return {Pool} a new Connection
 */
function getPoolConnection(cookie) {
    const mysql = require('mysql');
    return mysql.createPool({
        host: "localhost",
        user: "root",
        password: "parola",
        database: cookie.database,
        multipleStatements: true
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
            return "SELECT DISTINCT sex as filter FROM " + tableName;
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
        let con = getPoolConnection({database: "users"})
        const table = "active_admins";

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

    })
}

/**
 * This method is responsible for adding a registration account to be verified by admins in the the database.
 * @param jsonRegistrationAccount a json of username password and email
 * @returns {Promise<>} a new promise
 */
const addRegistrationUser = function (jsonRegistrationAccount) {
    return new Promise((resolve, reject) => {
        let con = getPoolConnection({database: "users"})
        const table = "registration_requests";

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

    })
}

/**
 * This method clears the whole logged_users table
 * @returns {Promise<>} a new promise
 */
const clearLoggedUsersTable = function () {
    return new Promise((resolve, reject) => {
        let con = getPoolConnection({database: "users"})
        const table = "logged_users";

                const sql = "TRUNCATE TABLE " + table;
                con.query(sql, function (err) {
                    if (err) {
                        reject("Failed to clear table '" + table + "' .REASON:" + err);
                    } else {
                        resolve("Successfully cleared table '" + table + "'.");
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
        let con = getPoolConnection({database: "users"})
        const table = "logged_users";

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

    })
}

/**
 * This method adds a new token to the logged_users table
 * @param jsonUser the user token with IP as json
 * @returns {Promise<>} a new promise
 */
const addUserToLoggedUsersTable = function (jsonUser) {
    return new Promise((resolve, reject) => {
        let con = getPoolConnection({database: "users"})
        const table = "logged_users";

                const sql = "INSERT INTO " + table + '(token,IP)' + " VALUES ('" + jsonUser.token + "','" + jsonUser.IP + "')";
                con.query(sql, function (err) {
                    if (err) {
                        console.log("Failed to add " + jsonUser.token + " to logged users." + "\nREASON: " + err.sqlMessage);
                        if (err.sqlMessage.toString().includes("Duplicate"))
                            resolve("User is already logged.")
                        else
                            reject("Failed to add " + jsonUser.token + " to logged users.");
                    } else {
                        console.log("Added " + jsonUser.token + " to logged users.");
                        resolve("Successfully logged in.");
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
        let con = getPoolConnection({database: "contact"})
        const table = "contact_messages";

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

    })
}

/**
 * This method checks if the token exists in the logged users table.
 * @return Promise<> a promise
 * @param token
 */
const selectTokenFromLoggedUsersTable = function (token) {
    return new Promise(async (resolve, reject) => {
        let con = getPoolConnection({database: "users"})
        const table = "logged_users";

                const sql = "SELECT token from " + table + " WHERE token='" + token + "'";
                con.query(sql, function (err, result) {
                    if (err) {
                        console.log("Failed to select " + token + " from logged users." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to select " + token + " from logged users.");
                    } else {
                        if (result.length > 0) {
                            // console.log("Found " + token + " in logged users.");
                            resolve(token);
                        } else {
                            // console.log("There is no " + token + " in logged users.");
                            resolve("There is no " + token + " in logged users.");
                        }
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
        let con = getPoolConnection({database: "contact"})
        const table = "contact_messages";

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

    })
}

/**
 * This method is responsible for getting all requested users from the registration requests table.
 * @return {Promise<>}
 */
const getRequestedUsersFromRegistrationRequestsTable = function () {
    return new Promise((resolve, reject) => {
        let con = getPoolConnection({database: "users"})
        const table = "registration_requests";

                const sql = "SELECT ID, name, email FROM " + table;
                con.query(sql, function (err, results, fields) {
                    if (err) {
                        reject("Failed select all from registration requests table.");
                    } else {
                        let jsonArray = [];
                        results.forEach(rowPacketObject => {
                                jsonArray.push(
                                    {
                                        "id": rowPacketObject.ID,
                                        "fullName": rowPacketObject.name,
                                        "email": rowPacketObject.email,
                                    })
                            }
                        )
                        resolve(jsonArray);
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
        let con = getPoolConnection({database: database})
        const table = tableName;

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
        let con = getPoolConnection({database: database})
        const table = tableName;
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
        let con = getPoolConnection({database: database})
        const table = tableName;

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

    })
}

/**
 * This method insert a new record in dataset
 * @param database the database
 * @param tableName the name of the table
 * @param data an object that contains the country, the year and the BMI value
 * @returns {Promise<>} a new promise
 */
const addDataInDataset = function (database, tableName, data) {
    return new Promise((resolve, reject) => {
        let con = getPoolConnection({database: database})
        const table = tableName;

                const sql = "INSERT INTO " + table + "(country, year, BMI_value) VALUES ('" + data.country + "', '" + data.year + "', '" + data.newBMI + "')";
                con.query(sql, function (err) {
                    if (err) {
                        console.log("Failed to add BMI of " + data.country + " in " + table + "." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to add BMI of " + data.country + " in " + table + ".");
                    } else {
                        console.log("Added BMI of " + data.country + " in " + table + ".");
                        resolve("Added BMI of " + data.country + " in " + table + ".");
                    }
                });

    })
}

/**
 * This method insert a new record in active admins and delete it from requested users
 * @param data an object that contains the user id
 * @returns {Promise<>} a new promise
 */
const acceptUsers = function (data) {
    return new Promise((resolve, reject) => {
        let con = getPoolConnection({database: 'users'})
        const sql = "INSERT INTO active_admins (ID, name, password, email) SELECT ID, name, password, email FROM registration_requests WHERE ID =" + data.id + ";" +
            "DELETE FROM registration_requests WHERE ID =" + data.id + ";";
        con.query(sql, function (err) {
            if (err) {
                console.log("Failed to add user" + "\nREASON: " + err.sqlMessage);
                reject("Failed to add user in active_admins.");
            } else {
                console.log("User added in active_admins.");
                resolve("User added in active_admins.");
            }
        });
    })
}

/**
 * This method is responsible for returning all the filters from the given database table with the filter specified.
 * @param database the database
 * @param tableName the table
 * @param filter the filter
 * @param regionsClause
 */
const getFiltersFromDataset = function (database, tableName, filter, regionsClause) {
    return new Promise(async (resolve, reject) => {
        let con = getPoolConnection({database: database})
        let sql = getSelectSQLQueryForFilter(filter, database, tableName)
        if (regionsClause !== '' && database !== 'eurostat') {
            sql += regionsClause;
        }
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
    });
}


/**
 * This method is responsible for returning all the filters from the given database table with the filter specified.
 * @param database the database
 * @param tableName the table
 * @param filter the filter
 */
const getDataset = async function (database, filter) {
    return new Promise(async (resolve, reject) => {
        let result;
        const massParam = filter.mass == '' ? 'obese' : filter.mass;

        let countriesParam = filter.countries;
        if (countriesParam.length === 0) {
            await getFiltersFromDataset(database, massParam, 'countries').then(res => {
                countriesParam = res;
            });
        }

        let allYears = [];
        await getFiltersFromDataset(database, massParam, 'years').then(res => {
            allYears = res;
        });

        let yearsParam = filter.years.length > 0 ? filter.years : allYears;

        await getInternalData(database, massParam, countriesParam, yearsParam, allYears).then(res => {
            result = res;
        });

        if (result) {
            resolve(result);
        } else {
            reject("Wrong data!");
        }
    });
}

/**
 * This method is responsible for checking if getCountryBMIValuePairsByYear method needs to be called or not
 * @param database
 * @param mass
 * @param countries
 * @param years
 * @param allYears
 * @returns {Promise<unknown>}
 */
async function getInternalData(database, mass, countries, years, allYears) {
    return new Promise(async (resolve, reject) => {
        let result = {
            labels: countries,
            years: {}
        };
        for (let i = 0; i < allYears.length; i++) {
            if (years.indexOf(allYears[i]) > -1) {
                await getCountryBMIValuePairsByYear(database, mass, countries, allYears[i]).then(res => {
                    result.years[allYears[i]] = res;
                }).catch(err => {
                    console.error(err);
                })
            } else {
                result.years[allYears[i]] = [];
            }
        }
        if (result) {
            resolve(result);
        } else {
            reject(result);
        }
    });
}

/**
 * This method is responsible for returning all the data from tables in order to apply the country and year filters
 * @param database
 * @param table
 * @param countries
 * @param year
 * @returns {Promise<unknown>}
 */
async function getCountryBMIValuePairsByYear(database, table, countries, year) {
    return new Promise(async (resolve, reject) => {
        let con = getPoolConnection({database: database})

                const sql = "SELECT country, BMI_value FROM " + table + " WHERE country IN (\"" + countries.join('", "') + "\") AND year = " + year;
                con.query(sql, function (err, results) {
                    if (err) {
                        console.log("Failed to select " + year + " from " + table + "." + "\nREASON: " + err.sqlMessage);
                        reject("Failed to select " + year + " from " + table + ".");
                    } else {
                        if (results.length > 0) {
                            let filtersArray = [];
                            results.forEach(row => {
                                filtersArray.push({
                                    country: row.country,
                                    BMI_value: row.BMI_value
                                });
                            })
                            resolve(filtersArray);
                        } else {
                            console.log("There is no data  filters:" + year + " from " + table + ".");
                            resolve(null);
                        }
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
module.exports.getDataset = getDataset;
module.exports.acceptUsers = acceptUsers;
module.exports.addDataInDataset = addDataInDataset;
module.exports.getRequestedUsersFromRegistrationRequestsTable = getRequestedUsersFromRegistrationRequestsTable;
