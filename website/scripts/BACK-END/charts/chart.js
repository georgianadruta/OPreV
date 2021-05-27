let dataset = {
    labels: null,
    data: Array()
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
