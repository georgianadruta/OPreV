let dataset = {
    labels: null,
    data: Array()
}

/**
 * This function's purpose is to do a HTTP request to receive the data.
 * TODO HTTP request
 * @returns {any[]} array of objects representing data
 */
function getDatasetDataHTTPRequest() {
    if (getCookie("dataset").toLowerCase() === 'eurostat') {

        let data = Array();
        data.push([14.0, 11.5, 18.3, 0, 15.8, 0, 0, 0, 0, 0, 18.5, 0, 17.6, 15.7, 12.2, 0, 0, 15.6, 16.9, 0, 0, 20.0, 22.9, 0, 12.8, 16.4, 0, 7.9, 16.8, 15.1, 0, 0, 0, 0, 0, 0, 0, 0, 16.2])
        data.push([14.0, 14.8, 19.3, 14.9, 16.9, 15.4, 15.9, 0, 0, 0, 20.4, 18.7, 17.3, 16.7, 15.3, 18.7, 10.8, 14.5, 21.3, 17.3, 15.6, 21.2, 26.0, 13.3, 14.7, 17.2, 16.6, 9.4, 19.2, 16.3, 18.3, 14.0, 19.0, 13.1, 0, 20.1, 0, 0, 21.2]);
        data.push([14.7, 14.6, 14.1, 20.5, 0, 14.9, 15.2, 15.2, 14.6, 0, 21.0, 15.2, 0, 14.1, 15.4, 18.2, 0, 14.7, 21.6, 17.4, 16.0, 20.0, 25.7, 12.7, 15.0, 16.9, 15.7, 10.4, 16.2, 14.4, 20.6, 0, 0, 14.2, 0, 21.0, 10.5, 13.3, 0]);
        return data;
    } else {
        let data = Array();
        data.push(['1', '2']);
        data.push(['1', '2']);
        data.push(['1', '2']);
        return data;
    }
}

/**
 * Getter for dataset labels
 * @returns {string[]}
 */
function getDatasetLabels() {
    //TODO GET LABELS BY HTTP REQUEST
    return dataset.labels;
}

/**
 * Getter for dataset object
 * @returns {any[]} dataset array
 */
function getDatasetData() {
    //TODO GET DATASET BY HTTP REQUEST
    return dataset.data;
}

/**
 * Setter for dataset.labels object.
 */
function setDatasetLabels(newLabels) {
    dataset.labels = newLabels;
}

/**
 * Setter for dataset.data object.
 */
function setDatasetData(newData) {
    dataset.data = newData;
}
