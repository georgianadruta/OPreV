const SERVER_HOST = '127.0.0.1';
const PORT = 8081;

// let dataset;

/**
 * Send HTTP request with url SERVER_HOST+PORT+"/dataset/+ datasetName (who/eurostat) and work with the data.
 * @param datasetName either "eurostat" or "who"
 */
let datasetHTTPRequest = function (datasetName) {
    const HTTP = new XMLHttpRequest();
    const url = SERVER_HOST + PORT + "/dataset/" + datasetName;
    HTTP.open("GET", url);
    HTTP.send();
    HTTP.onreadystatechange = (e) => {
        console.log(HTTP.responseText)
        //TODO change dataset object based on the response
    }
}

/**
 * This function's purpose is to load the specified dataset
 * @param datasetName either "eurostat" or "who"
 */
function loadDataSet(datasetName) {
    if (datasetName.toLowerCase() === "eurostat") {
        datasetHTTPRequest("eurostat");
    }
    if (datasetName.toLowerCase() === "who") {
        datasetHTTPRequest("who");
    }
}

/**
 * By default load eurostat.
 */
window.onload = function () {
    loadDataSet("eurostat");
}