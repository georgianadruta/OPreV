const SERVER_HOST = '127.0.0.1';
const PORT = 8081;

/**
 * Send HTTP request with url SERVER_HOST+':'+PORT+"/dataset/+ datasetName (who/eurostat) based on the cookie and work with the data.
 */
let datasetHTTPRequest = function () {
    const datasetName = getCookie("dataset");
    if (datasetName == null) console.error("dataset cookie error! Got cookie value: '" + datasetName + "' from cookie named 'dataset'.");

    const HTTP = new XMLHttpRequest();
    const url = "/dataset/" + datasetName;
    HTTP.onreadystatechange = () => {
        if (HTTP.readyState === HTTP.DONE)
            console.log(HTTP.responseText)
        //TODO change dataset object based on the response
    }
    HTTP.open("GET", url);
    HTTP.setRequestHeader("Cookies", document.cookie);
    HTTP.send();
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
    datasetHTTPRequest();
}

/**
 * This function's purpose is to load the specified body mass.
 * Sets the cookie
 * @param bodyMassName either 'overweight' 'pre-obese' or 'obese'
 */
function loadBodyMass(bodyMassName) {
    if (bodyMassName === 'overweight' || bodyMassName === 'pre-obese' || bodyMassName === 'obese')
        window.localStorage.setItem("bodyMass", bodyMassName);
    else {
        window.localStorage.setItem("bodyMass", 'overweight');
        console.error("ERROR: wrong call on loadBodyMass function: loadBodyMass(" + bodyMassName + ").")
    }
    datasetHTTPRequest();
}

/**
 * TODO get BMI filters via HTTP request
 * @returns {string[]}  array of strings
 */
function getBMIFiltersHTTPRequest() {
    if (getCookie("dataset").toLowerCase() === "eurostat")
        return ['Obese', 'Pre-obese', 'Overweight'];
    if (getCookie("dataset").toLowerCase() === "who")
        return ['1', '2', '3'];
}

/**
 * TODO get Years filters via HTTP request
 * @returns {string[]}  array of strings
 */
function getYearsFiltersHTTPRequest() {
    if (getCookie("dataset").toLowerCase() === "eurostat")
        return ['2008', '2014', '2017'];
    if (getCookie("dataset").toLowerCase() === "who")
        return ['1', '2', '3'];
}

/**
 * TODO get Sex filters via HTTP request
 * @returns {string[]}  array of strings
 */
function getSexFiltersHTTPRequest() {
    if (getCookie("dataset").toLowerCase() === "eurostat")
        return ["Both sexes"];
    if (getCookie("dataset").toLowerCase() === "who")
        return ['Female', 'Male', 'Both sexes'];
}

/**
 * TODO get Regions filters via HTTP request
 * @returns {string[]}  array of strings
 */
function getRegionsFiltersHTTPRequest() {
    if (getCookie("dataset").toLowerCase() === "eurostat")
        return ["Europe"];
    if (getCookie("dataset").toLowerCase() === "who")
        return ['Africa', 'Europe', 'TODO add others'];
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
async function modifyDataFromAdminPageHTTPRequest(id) {
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
                            tableColumns: ["Server messages"],
                            dataset: ["No new messages"],
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
 *  * This method is responsible for the HTTP GET request to receive the contact messages.
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
                            tableColumns: ["server_messages"],
                            dataset: [{server_messages: "No new messages"}],
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
 * TODO
 * This method is responsible for the HTTP GET request to receive the contact messages.
 * @return {*[]}
 */
function getWhoDatasetHTTPRequest(filters = null) {
    if (filters !== null)
        return [];
    return [];
}

/** TODO
 * This method is responsible for the HTTP GET request to receive the contact messages.
 * @return {*[]}
 */
function getEurostatDatasetHTTPRequest(filters = null) {
    if (filters !== null)
        return [];
    return [];
}


/**
 * By default load eurostat.
 */
window.addEventListener("load", function () {
    if (getCookie("dataset") === null) setCookie("dataset", "eurostat");
    datasetHTTPRequest();
});