let dataset = {
    labels: null,
    data: Array()
}

let currentCheckboxId = 0;

/**
 * This function's purpose is to do a HTTP request to receive the labels.
 * TODO HTTP request
 * @returns {string[]} array of strings each representing a label
 */
function getLabelsHTTPRequest() {
    return ['Belgium', 'Bulgaria', 'Czechia', 'Denmark', 'Estonia', 'Ireland', 'Greece', 'Spain', 'France', 'Croatia', 'Italy', 'Germany', 'European Union - 27 countries (from 2020)', 'European Union - 28 countries (2013-2020)', 'European Union - 27 countries (2007-2013)', 'Euro area - 19 countries  (from 2015)', 'Euro area - 18 countries (2014)', 'Cyprus', 'Latvia', 'Lithuania', 'Luxembourg', 'Hungary', 'Malta', 'Netherlands', 'Austria', 'Poland', 'Portugal', 'Romania', 'Slovenia', 'Slovakia', 'Finland', 'Sweden', 'Iceland', 'Norway', 'Switzerland', 'United Kingdom', 'North Macedonia', 'Serbia', 'Turkey'];
}

/**
 * This function's purpose is to do a HTTP request to receive the data.
 * TODO HTTP request
 * @returns {any[]} array of objects representing data
 */
function getDatasetDataHTTPRequest() {
    let data = Array();
    data.push([14.0, 11.5, 18.3, 0, 15.8, 0, 0, 0, 0, 0, 18.5, 0, 17.6, 15.7, 12.2, 0, 0, 15.6, 16.9, 0, 0, 20.0, 22.9, 0, 12.8, 16.4, 0, 7.9, 16.8, 15.1, 0, 0, 0, 0, 0, 0, 0, 0, 16.2])
    data.push([14.0, 14.8, 19.3, 14.9, 16.9, 15.4, 15.9, 0, 0, 0, 20.4, 18.7, 17.3, 16.7, 15.3, 18.7, 10.8, 14.5, 21.3, 17.3, 15.6, 21.2, 26.0, 13.3, 14.7, 17.2, 16.6, 9.4, 19.2, 16.3, 18.3, 14.0, 19.0, 13.1, 0, 20.1, 0, 0, 21.2]);
    data.push([14.7, 14.6, 14.1, 20.5, 0, 14.9, 15.2, 15.2, 14.6, 0, 21.0, 15.2, 0, 14.1, 15.4, 18.2, 0, 14.7, 21.6, 17.4, 16.0, 20.0, 25.7, 12.7, 15.0, 16.9, 15.7, 10.4, 16.2, 14.4, 20.6, 0, 0, 14.2, 0, 21.0, 10.5, 13.3, 0]);
    return data;
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
 * This function's purpose is to select all countries filters.
 */
function selectAllCountries() {
    hardcode();//TODO DELETE THIS LATER
    let labels = getDatasetLabels();
    for (let i = 0; i < labels.length; i++) {
        const checkbox = document.getElementById('country' + i);
        checkbox.type = 'checkbox';
        checkbox.checked = true;
    }

    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "chart_bar.html") {
        const chart = getBarChart();
        chart.data.labels = labels;
        chart.data.datasets[0].data = getDatasetData()[0];
        chart.data.datasets[1].data = getDatasetData()[1];
        chart.data.datasets[2].data = getDatasetData()[2];
        chart.update();
    } else {
        const tableData = getTableData();
        tableData.labels = labels;
        tableData.data[0] = getDatasetData()[0];
        tableData.data[1] = getDatasetData()[1];
        tableData.data[2] = getDatasetData()[2];
        generateTable();
    }


    if (page === "chart_bar.html") {
        chart.update();
    } else {
        generateTable();
    }

    removeCountryIds = [];
    setCookie("countries", "all");
}

/**
 * This function's purpose is to deselect all countries filters.
 */
function deselectAllCountries() {
    let labels = getDatasetLabels();
    if (labels !== null) {
        for (let i = 0; i < labels.length; i++) {
            const checkbox = document.getElementById('country' + i);
            checkbox.type = 'checkbox';
            checkbox.checked = false;
        }

        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.data.datasets[1].data = [];
        chart.data.datasets[2].data = [];
        chart.update();
        removeCountryIds = [...Array(labels.length).keys()];

    }
    setCookie("countries", "none");
}

/**
 * This function's purpose is to remove a certain country from the chart for bar and table charts
 * @param id the id of the country of which will be removed from the graph
 */
function removeCountryFromChart(id) {
    if (removeCountryIds.includes(id)) {
        let index = removeCountryIds.indexOf(id);
        removeCountryIds.splice(index, 1);
    } else {
        removeCountryIds.push(id);
    }

    let labelsCopy = [...getDatasetLabels()];
    let dataset1Copy = [...getDatasetData()[0]];
    let dataset2Copy = [...getDatasetData()[1]];
    let dataset3Copy = [...getDatasetData()[2]];

    for (let i = 0; i < removeCountryIds.length; i++) {
        labelsCopy[removeCountryIds[i]] = undefined;
        dataset1Copy[removeCountryIds[i]] = undefined;
        dataset2Copy[removeCountryIds[i]] = undefined;
        dataset3Copy[removeCountryIds[i]] = undefined;
    }

    chart.data.labels = labelsCopy.filter(x => x !== undefined);
    chart.data.datasets[0].data = dataset1Copy.filter(x => x !== undefined);
    chart.data.datasets[1].data = dataset2Copy.filter(x => x !== undefined);
    chart.data.datasets[2].data = dataset3Copy.filter(x => x !== undefined);
    chart.update();
}

/**
 * This function's purpose is to set only one checkbox as ticked. Similar to radar button.
 * @param id the id of the country of which the checkbox will be ticked
 */
function selectOnlyOneCountryFromChart(id) {
    console.log(id);
    //remove old id
    const oldCheckbox = document.getElementById('country' + currentCheckboxId);
    oldCheckbox.type = 'checkbox';
    oldCheckbox.checked = false;
    //set the new checkbox as ticked
    const checkbox = document.getElementById('country' + id);
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    //update currentCheckboxId
    currentCheckboxId = id;
}

function hardcode() {
    dataset.labels = getLabelsHTTPRequest();
    dataset.data = getDatasetDataHTTPRequest();
}