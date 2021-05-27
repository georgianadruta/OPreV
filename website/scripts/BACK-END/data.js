/**
 * This method's purpose is to return the request URL based on cookies
 * @return {string} the url
 */
let getURLBasedOnCookies = function () {
    let url = '/dataset';
    let dataset = getCookie("dataset");
    url += '/' + dataset;
    return url;
}

/**
 * This function's purpose is to load the specified dataset.
 * Sets the cookie
 * @param datasetName either 'who' or 'eurostat'
 */
function loadDataSet(datasetName) {
    if (datasetName === 'who' || datasetName === 'eurostat') {
        window.localStorage.setItem("dataset", datasetName);
        refreshFilters();
    } else {
        window.localStorage.setItem("dataset", 'eurostat');
        console.error("ERROR: wrong call on loadDataSet function: loadDataset(" + datasetName + ").")
    }
    getDatasetHTTPRequest();
}


/**
 * TODO get BMI filters via HTTP request
 * @returns {string[]}  array of strings
 */
function getBMIIndicatorsHTTPRequest() {
    if (getCookie("dataset").toLowerCase() === "eurostat")
        return ['Obese', 'Pre-obese', 'Overweight'];
    if (getCookie("dataset").toLowerCase() === "who")
        return ['1', '2', '3'];
}

/**
 * TODO get Years filters via HTTP request
 * @returns {string[]}  array of strings
 */
function getYearsHTTPRequest() {
    if (getCookie("dataset").toLowerCase() === "eurostat")
        return ['2008', '2014', '2017'];
    if (getCookie("dataset").toLowerCase() === "who")
        return ['1', '2', '3'];
}

/**
 * TODO get Sex filters via HTTP request
 * @returns {string[]}  array of strings
 */
function getSexesHTTPRequest() {
    if (getCookie("dataset").toLowerCase() === "eurostat")
        return ["Both sexes"];
    if (getCookie("dataset").toLowerCase() === "who")
        return ['Female', 'Male', 'Both sexes'];
}

/**
 * TODO get Regions filters via HTTP request
 * @returns {string[]}  array of strings
 */
function getRegionsHTTPRequest() {
    if (getCookie("dataset").toLowerCase() === "eurostat")
        return ["Europe"];
    if (getCookie("dataset").toLowerCase() === "who")
        return ['Africa', 'Europe', 'TODO add others'];
}

/**
 * This function returns an array of strings with all the possible values for the given filter
 * @param filterName the name of the filter. Exactly one of the fallowing: 'countries', 'sexes', 'BMIIndicators','years','regions'
 * @return {Promise<>} a new Promise
 */
async function getAllPossibleValuesOfFilterHTTPRequest(filterName) {
    return await new Promise((resolve, reject) => {
        setCookie("filter", filterName);
        const HTTP = new XMLHttpRequest();
        const url = getURLBasedOnCookies() + '/filters';
        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                deleteCookie("filter");
                if (HTTP.status >= 400) {
                    console.log(HTTP.responseText);
                    reject();
                } else {
                    let data = JSON.parse(HTTP.responseText);
                    console.log(data);
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
 * TODO get Countries  via HTTP request
 * TODO HTTP request
 * @returns {string[]} array of strings each representing a label
 */
async function getCountriesHTTPRequest() {
    await getDatasetHTTPRequest().then(result => {
        tableInformation = result
    })
    let countryList = [];
    for (let i = 0; i < tableInformation.dataset.length; i = i + 3) {
        countryList.push(tableInformation.dataset[i].country);
    }
    return countryList;
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
            case"who_dataset": {
                url = "/dataset/who";
                break;
            }
            case"eurostat_dataset": {
                url = "/dataset/eurostat";
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
 *  * This method is responsible for the HTTP POST request to delete a certain message by ID.
 * @return {Promise<>}
 */
async function modifyDataFromAdminPageHTTPRequest(jsonObject) {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = getURLBasedOnCookies();

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
 * This method is responsible for the HTTP GET request to receive the database data.
 * In resolve we return an JSON under the fallowing format:
 * {
 *     tableColumns: Array(String)      ->  all of the columns from the table
 *     dataset:Array(JSON objects)      ->  all data under JSON format  {column1: data1, column2:data2,..... }
 * }
 * @return Promise<>
 */
async function getDatasetHTTPRequest(filters = null) {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = getURLBasedOnCookies();
        setCookie("filters", filters);
        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                deleteCookie("filters")
                if (HTTP.status >= 400) {
                    console.log(HTTP.responseText);
                    reject();
                } else {
                    let data = JSON.parse(HTTP.responseText);
                    if (data.tableColumns.length > 0)
                        data.dataset = JSON.parse(data.dataset);
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
 * By default load eurostat.
 */
window.addEventListener("load", function () {
    if (getCookie("dataset") === null) setCookie("dataset", "eurostat");
    if (getCookie("BMIIndicator") == null) setCookie("BMIIndicator", "obese");
});