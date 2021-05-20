const SERVER_HOST = '127.0.0.1';
const PORT = 8081;

// let dataset;

/**
 * Send HTTP request with url SERVER_HOST+PORT+"/dataset/+ datasetName (who/eurostat) and work with the data.
 * @param datasetName either "eurostat" or "who"
 */
let datasetHTTPRequest = function (datasetName) {
    const HTTP = new XMLHttpRequest();
    const url = SERVER_HOST + ':' + PORT + "/dataset/" + datasetName;
    HTTP.open("GET", url);
    HTTP.send();
    HTTP.onreadystatechange = () => {
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
window.addEventListener("load", function () {
    loadDataSet("eurostat");
});


/**
 * This method's purpose is to return the dataset based on the datasetNr parameter
 * TODO HARDCODED. Return actual values from database
 * @param datasetNr number representing the client's option
 * @returns {[string[], {spanGaps: boolean, borderColor: string, tension: number, pointHoverRadius: number, data: (number|number)[], pointHoverBorderColor: string, label: string, fill: boolean}, {spanGaps: boolean, borderColor: string, tension: number, data: (number|number)[], label: string, fill: boolean}, {spanGaps: boolean, borderColor: string, tension: number, data: (number|number)[], label: string, fill: boolean}]}
 */
const generateDatasetLineChart = function (datasetNr) {
    const data_labels = ["2010", "2012", "2014", "2016", "2018", "2020", "2021-present"]

    const Overweight_dataset1 = [NaN, NaN, NaN, 51.1, NaN, 51.8, NaN];
    const PreObese_dataset1 = [NaN, NaN, NaN, 35.7, NaN, 36.9, NaN];
    const Obese_dataset1 = [NaN, NaN, NaN, 15.4, NaN, 14.6, NaN];

    const Overweight_dataset2 = [NaN, NaN, NaN, 21.1, NaN, 41.8, NaN];
    const PreObese_dataset2 = [NaN, NaN, NaN, 31.1, NaN, 68.8, NaN];
    const Obese_dataset2 = [NaN, NaN, NaN, 11.1, NaN, 62.8, 65.5];

    if (datasetNr === 1)
        return [data_labels,
            {
                label: 'Overweight by BMI',
                data: Overweight_dataset1,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0,
                spanGaps: true,
                pointHoverBorderColor: "black",
                pointHoverRadius: 7
            },
            {
                label: 'PreObese BMI',
                data: PreObese_dataset1,
                fill: false,
                borderColor: 'red',
                tension: 0,
                spanGaps: true
            },
            {
                label: 'Obese by BMI',
                data: Obese_dataset1,
                fill: false,
                borderColor: 'black',
                tension: 0,
                spanGaps: true
            },
        ]
    else
        return [data_labels,
            {
                label: 'Overweight by BMI',
                data: Overweight_dataset2,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0,
                spanGaps: true,
                pointHoverBorderColor: "black",
                pointHoverRadius: 7
            },
            {
                label: 'PreObese BMI',
                data: PreObese_dataset2,
                fill: false,
                borderColor: 'red',
                tension: 0,
                spanGaps: true
            },
            {
                label: 'Obese by BMI',
                data: Obese_dataset2,
                fill: false,
                borderColor: 'black',
                tension: 0,
                spanGaps: true
            },
        ]
}