let removeCountryIds = [];
let currentCountryCheckboxId = 0;

/**
 * This function's purpose is to create the checkboxes for the countries
 */
async function createCountriesCheckboxes() {
    let labels = null;
    await getAllPossibleValuesOfFilterHTTPRequest('countries').then(result => {
        labels = result
    }).catch(err => console.error(err));
    if (labels == null) return;
    const container = document.getElementById('countries');
    container.innerHTML = '';//clear content
    for (let i = 0; i < labels.length; i++) {
        const parent = document.createElement('div');
        parent.className = 'country';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'country' + i;
        checkbox.name = 'countries';
        checkbox.value = labels[i];
        checkbox.checked = false;

        removeCountryIds.push(i);//by default all are removed

        const path = window.location.pathname;
        const page = path.split("/").pop();
        if (page === "chart_line.html") {
            checkbox.onclick = function () {
                selectOnlyOneCountryFromChart(i);
            };
        } else if (page === "chart_bar.html") {
            checkbox.checked = true;
        } else {
            checkbox.onclick = function () {
                addOrRemoveCountryFromChart(i);
            };
        }

        const label = document.createElement('label');
        label.htmlFor = 'country' + i;
        label.appendChild(document.createTextNode(labels[i]));

        parent.appendChild(checkbox);
        parent.appendChild(label);

        container.appendChild(parent);
    }
    window.localStorage.setItem('countries', 'none')
}

/**
 * This function's purpose is to select all countries filters.
 */
async function selectAllCountries() {
    let countryList;
    await getAllPossibleValuesOfFilterHTTPRequest('countries').then(result => {
        countryList = result
    })
    setDatasetLabels(countryList);
    let localStorageCountries = String();
    let labels = getDatasetLabels();
    for (let i = 0; i < labels.length; i++) {
        const checkbox = document.getElementById('country' + i);
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        localStorageCountries += labels[i] + ' ';
    }
    localStorageCountries = localStorageCountries.slice(0, -1);
    // setDatasetData(getDatasetHTTPRequest());
    // const path = window.location.pathname;
    // const page = path.split("/").pop();
    // if (page === "chart_bar.html") {
    //     const chart = barChart.getChart();
    //     chart.data.labels = labels;
    //     chart.data.datasets[0].data = getDatasetData()[0];
    //     chart.data.datasets[1].data = getDatasetData()[1];
    //     chart.data.datasets[2].data = getDatasetData()[2];
    // } else {
    //     const tableData = tableChart.getTableData();
    //     tableData.tableColumns = labels;
    //     tableData.dataset[0] = getDatasetHTTPRequest()[0];
    //     tableData.dataset[1] = getDatasetHTTPRequest()[1];
    //     tableData.dataset[2] = getDatasetHTTPRequest()[2];
    // }
    //
    // if (page === "chart_bar.html") { TODO CHANGE THIS TO AFFECT LINE CHART TOO
    //     chart.update();
    // } else {
    //     tableChart.refreshTableData();
    //     tableChart.generateTable();
    // }

    removeCountryIds = [];
    window.localStorage.setItem("countries", localStorageCountries);
}

/**
 * This function's purpose is to deselect all countries filters.
 */
async function deselectAllCountries() {
    let labels;
    await getAllPossibleValuesOfFilterHTTPRequest('countries').then(result => {
        labels = result
    })
    if (labels !== null) {
        for (let i = 0; i < labels.length; i++) {
            const checkbox = document.getElementById('country' + i);
            checkbox.type = 'checkbox';
            checkbox.checked = false;
        }
        setDatasetLabels([])
        setDatasetData([]);
        const path = window.location.pathname;
        const page = path.split("/").pop();
        if (page === "chart_bar.html") {
            // const chart = barChart.getChart();
            // barChart.refreshChartData();
            // chart.update();
        } else if (page === "chart_line.html") {
            const chart = lineChart.getChart();
            chart.update();
        } else {
            tableChart.refreshTableData();
            tableChart.generateTable();
        }
        removeCountryIds = [...Array(labels.length).keys()];
    }
    // window.localStorage.setItem("countries", "none");
}

/**
 * This function's purpose is to remove a certain country from the chart for bar and table charts
 * @param id the id of the country of which will be removed from the graph
 */
function addOrRemoveCountryFromChart(id) {
    //if it exists in removeCountryIds
    if (removeCountryIds.includes(id)) {
        let index = removeCountryIds.indexOf(id);//delete it
        removeCountryIds.splice(index, 1);
        addDataToDatasetByCountryID(id);
    } else {
        removeCountryIds.push(id);//else add it
        removeDataToDatasetByCountryID(id);
    }

    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "chart_bar.html") {
        barChart.refreshChartData();
        barChart.getChart().update();
    } else if (page === "chart_line.html") {
        lineChart.refreshChartData();
        lineChart.getChart().update();
    } else {
        tableChart.refreshTableData();
        tableChart.generateTable();
    }
}

/**
 * This function's purpose is to add a country's data to the dataset based on it's id.
 * @param id the id of the country
 */
async function addDataToDatasetByCountryID(id) {
    let labels;
    await getAllPossibleValuesOfFilterHTTPRequest('countries').then(countriesArray => {
        labels = countriesArray
    });
    const data = getDatasetHTTPRequest();

    let newLabels = getDatasetLabels();
    if (newLabels == null) newLabels = Array();
    newLabels.push(labels[id]);
    let delimiter = ' ';
    if (window.localStorage.getItem("countries").search("none") !== -1) {
        window.localStorage.setItem("countries", '');
        delimiter = '';
    }
    window.localStorage.setItem("countries", window.localStorage.getItem("countries") + delimiter + labels[id]);

    let newData = getDatasetData();
    //if datasetData is empty make datasetData.length arrays
    if (newData.length < 1)
        for (let i = 0; i < data.length; i++) {
            newData[i] = Array();
        }
    //for each element add corresponding data
    for (let i = 0; i < data.length; i++) {
        newData[i].push(data[i][id]);
    }

    //set the newDataset
    setDatasetLabels(newLabels);
    setDatasetData(newData);
}

/**
 * This function's purpose is to remove a country's data to the dataset based on it's id.
 * @param id the id of the country
 */
async function removeDataToDatasetByCountryID(id) {
    let country;
    await getAllPossibleValuesOfFilterHTTPRequest('countries').then(countriesArray => {
        country = countriesArray[id];
    });
    let newLabels = getDatasetLabels();
    let index = newLabels.indexOf(country);//delete it
    newLabels.splice(index, 1);
    window.localStorage.setItem("countries", window.localStorage.getItem("countries").replaceAll(country, ''));
    window.localStorage.setItem("countries", window.localStorage.getItem("countries").replaceAll("  ", ' '));
    const regExp = /(\s*[a-zA-Z]+\s*)+/g;
    if (regExp.test(window.localStorage.getItem("countries")) === false)
        window.localStorage.setItem("countries", "none");
    let newData = getDatasetData();
    //for each element add corresponding data
    for (let i = 0; i < newData.length; i++) {
        newData[i].splice(index, 1);
    }
    //set the newDataset
    setDatasetLabels(newLabels);
    setDatasetData(newData);
}

/**
 * This function's purpose is to set only one checkbox as ticked. Similar to radar button.
 * @param id the id of the country of which the checkbox will be ticked
 */
function selectOnlyOneCountryFromChart(id) {
    console.log(id);
    //remove old id
    const oldCheckbox = document.getElementById('country' + currentCountryCheckboxId);
    oldCheckbox.type = 'checkbox';
    oldCheckbox.checked = false;
    //set the new checkbox as ticked
    const checkbox = document.getElementById('country' + id);
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    //update currentCheckboxId
    currentCountryCheckboxId = id;
}
