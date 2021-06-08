/**
 * This function's purpose is to return an encoded uri session storage item.
 * @param sessionStorageItemName
 * @returns {string} encoded uri session storage item
 */
function getSessionStorageAsQuery(sessionStorageItemName) {
    let sessionStorage = window.sessionStorage.getItem(sessionStorageItemName);
    if (sessionStorage !== null) {
        return encodeURIComponent(sessionStorage);
    } else {
        return '';
    }
}

/**
 * This function returns query params based on session storage filters.
 */
function getParamsBasedOnSessionStorage(querySexes = true, queryRegions = true, queryYears = true, queryCountries = true) {
    let query = "?";
    query += "dataset=" + getSessionStorageAsQuery("dataset");
    query += "&";
    query += "BMIFilter=" + getSessionStorageAsQuery("BMIFilter");
    if (querySexes === true) {
        query += "&";
        query += "SexFilter=" + getSessionStorageAsQuery("SexFilter");
    }
    if (queryRegions === true) {
        query += "&";
        query += "RegionsFilter=" + getSessionStorageAsQuery("RegionsFilter");
    }
    if (queryYears === true) {
        query += "&";
        query += "years=" + getSessionStorageAsQuery("years");
    }
    if (queryCountries === true) {
        query += "&";
        query += "countries=" + getSessionStorageAsQuery("countries");
    }
    return query;
}

/**
 * This method's purpose is to return the request URL based on cookies
 * @return {string} the url
 */
let getURLBasedOnSessionStorage = function () {
    let url = '/dataset';
    let dataset = window.sessionStorage.getItem("dataset");
    url += '/' + dataset;
    return url;
}

/**
 * This function's purpose is to load the specified dataset.
 * Sets the session storage
 * @param datasetName either 'who' or 'eurostat'
 */
function loadDataSet(datasetName) {
    if (datasetName === 'who' || datasetName === 'eurostat') {
        window.sessionStorage.setItem("dataset", datasetName);
    } else {
        window.sessionStorage.setItem("dataset", 'eurostat');
        console.error("ERROR: wrong call on loadDataSet function: loadDataset(" + datasetName + ").")
    }
}

/**
 * This function returns an array of strings with all the possible values for the given filter
 * @return {Promise<>} a new Promise
 * @param fieldName
 */
async function getAllPossibleValuesOfFilterHTTPRequest(fieldName) {
    return await new Promise((resolve, reject) => {
        setCookie("field", fieldName);
        const HTTP = new XMLHttpRequest();
        const url = getURLBasedOnSessionStorage() + '/filters';
        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                deleteCookie("field");
                if (HTTP.status >= 400) {
                    console.log(HTTP.responseText);
                    reject();
                } else {
                    let data = JSON.parse(HTTP.responseText);
                    resolve(data);
                }
            }
        }
        HTTP.open("GET", url);
        HTTP.setRequestHeader("Cookies", document.cookie);
        HTTP.send();
    })
}

/**
 *  * This method is responsible for the HTTP DELETE request to delete a certain message by ID.
 * @return {Promise<>}
 */
async function deleteDataFromAdminPageHTTPRequest(jsonObject) {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        let url;
        switch (window.sessionStorage.getItem('deleteTable')) {
            case "contact_messages": {
                url = "/contact/messages";
                break;
            }
            case "who_dataset": {
                url = "/dataset/who";
                break;
            }
            case "eurostat_dataset": {
                url = "/dataset/eurostat";
                break;
            }
            case "registration_requests": {
                url = "/users/requests";
                break;
            }
            default: {
                reject("Failed. Invalid table selected.");
                return;
            }
        }
        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                if (HTTP.status >= 400) {
                    reject("Failed DELETE request");
                } else {
                    if (HTTP.responseText === "User is not logged.") {
                        reject(HTTP.responseText);
                        return;
                    }
                    resolve(HTTP.responseText);
                }
            }
        }
        HTTP.open("DELETE", url);
        HTTP.setRequestHeader("Cookies", document.cookie);
        HTTP.send(JSON.stringify(jsonObject));
    })
}

/**
 *  * This method is responsible for the HTTP POST request to add data to dataset.
 * @return {Promise<>}
 */
async function addDataFromAdminPageHTTPRequest(jsonObject) {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = '/dataset/add';

        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                if (HTTP.status >= 400) {
                    console.error(HTTP.responseText);
                    reject("Fail")
                } else {
                    resolve(HTTP.responseText);
                }
            }

        }
        HTTP.open("POST", url);
        HTTP.setRequestHeader("Cookies", document.cookie);
        HTTP.send(JSON.stringify(jsonObject));
    })
}

/**
 *  * This method is responsible for the HTTP POST request to accept a user.
 * @return {Promise<>}
 */
async function acceptUserHTTPRequest(jsonObject) {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = '/users/requests';

        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                if (HTTP.status >= 400) {
                    console.error(HTTP.responseText);
                    reject("Fail")
                } else {
                    resolve(HTTP.responseText);
                }
            }

        }
        HTTP.open("POST", url);
        HTTP.setRequestHeader("Cookies", document.cookie);
        HTTP.send(JSON.stringify(jsonObject));
    })
}

/**
 *  * This method is responsible for the HTTP POST request to modify the data from the dataset.
 * @return {Promise<>}
 */
async function modifyDataFromAdminPageHTTPRequest(jsonObject) {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = getURLBasedOnSessionStorage();

        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                if (HTTP.status >= 400) {
                    console.error(HTTP.responseText);
                    reject("Fail")
                } else {
                    if (HTTP.responseText === "Success")
                        resolve("Successfully modified data.");
                    else
                        reject("Filed to modify data.");
                }
            }

        }
        HTTP.open("POST", url);
        HTTP.setRequestHeader("Cookies", document.cookie);
        HTTP.send(JSON.stringify(jsonObject));
    })

}


/**
 * This method is responsible for the HTTP GET request to receive the contact messages.
 * @return {Promise<>}
 */
async function getContactMessagesDatasetHTTPRequest() {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = "/contact/messages";

        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                if (HTTP.status >= 400) {
                } else {
                    if (HTTP.responseText === "User is not logged.") {
                        reject(HTTP.responseText);
                        return;
                    }
                    let jsonArray = JSON.parse(HTTP.responseText);
                    if (jsonArray.length > 0)
                        resolve({
                            tableColumns: Object.keys(jsonArray[0]),
                            dataset: jsonArray,
                        });
                    else {
                        resolve({
                            tableColumns: [],
                            dataset: [],
                        });
                    }
                }
            }
        }
        HTTP.open("GET", url);
        HTTP.setRequestHeader("Cookies", document.cookie);
        HTTP.send();
    })

}

/**
 * This method is responsible for the HTTP GET request to receive the users request.
 * @return {Promise<>}
 */
async function getRequestUsersDatasetHTTPRequest() {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = "/users/requests";

        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                if (HTTP.status >= 400) {
                } else {
                    if (HTTP.responseText === "User is not logged.") {
                        reject(HTTP.responseText);
                        return;
                    }
                    let jsonArray = JSON.parse(HTTP.responseText);
                    if (jsonArray.length > 0)
                        resolve({
                            tableColumns: Object.keys(jsonArray[0]),
                            dataset: jsonArray,
                        });
                    else {
                        resolve({
                            tableColumns: [],
                            dataset: [],
                        });
                    }
                }
            }

        }
        HTTP.open("GET", url);
        HTTP.setRequestHeader("Cookies", document.cookie);
        HTTP.send();
    })

}

/**
 * This method is responsible for the HTTP GET request to receive the database data.
 * In resolve we return an JSON under the following format:
 * {
 *     tableColumns: Array(String)      ->  all of the columns from the table
 *     dataset:Array(JSON objects)      ->  all data under JSON format  {column1: data1, column2:data2,..... }
 * }
 * @return Promise<>
 */
async function getDatasetHTTPRequest() {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = getURLBasedOnSessionStorage();
        const params = getParamsBasedOnSessionStorage();
        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                if (HTTP.status >= 400) {
                    console.log(HTTP.responseText);
                    reject(HTTP.responseText);
                } else {
                    let data = JSON.parse(HTTP.responseText);
                    if (data.tableColumns.length > 0)
                        data.dataset = JSON.parse(data.dataset);
                    resolve(data);
                }
            }
        }
        HTTP.open("GET", url + params);
        HTTP.setRequestHeader("Cookies", document.cookie);
        HTTP.send();
    })
}

async function getDataForCountryHTTPRequest(countryName) {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = getURLBasedOnSessionStorage();
        let oldSessionStorageCountries = window.sessionStorage.getItem("countries");
        window.sessionStorage.setItem("countries", countryName);
        const params = getParamsBasedOnSessionStorage(false, false, false, true);
        window.sessionStorage.setItem("countries", oldSessionStorageCountries);
        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                if (HTTP.status >= 400) {
                    console.log(HTTP.responseText);
                    reject(HTTP.responseText);
                } else {
                    let data = JSON.parse(HTTP.responseText);
                    if (data.tableColumns.length > 0)
                        data.dataset = JSON.parse(data.dataset);
                    resolve(data);
                }
            }
        }
        HTTP.open("GET", url + params);
        HTTP.setRequestHeader("Cookies", document.cookie);
        HTTP.send();
    })
}

let barChart;
let tableChart;
let lineChart;
