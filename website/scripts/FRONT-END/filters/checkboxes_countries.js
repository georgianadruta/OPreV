let removeCountryIds = [];
let currentCountryCheckboxId = 0;

/**
 * This function's purpose is to create the checkboxes for the countries
 */
async function createCountriesCheckboxes() {
    removeCountryIds = [];
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

        checkbox.onclick = function () {
            addOrRemoveCountryFromChart(i);
        };

        const label = document.createElement('label');
        label.htmlFor = 'country' + i;
        label.appendChild(document.createTextNode(labels[i]));

        parent.appendChild(checkbox);
        parent.appendChild(label);

        container.appendChild(parent);
    }
    window.sessionStorage.setItem('countries', '')
}

/**
 * This function's purpose is to select all countries filters.
 */
async function selectAllCountries() {
    let countryList;
    await getAllPossibleValuesOfFilterHTTPRequest('countries').then(result => {
        countryList = result;
        let sessionStorageCountries = String();
        for (let i = 0; i < countryList.length; i++) {
            const checkbox = document.getElementById('country' + i);
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            sessionStorageCountries += countryList[i] + ',';
        }
        sessionStorageCountries = sessionStorageCountries.slice(0, -1);
        window.sessionStorage.setItem("countries", sessionStorageCountries);
        const path = window.location.pathname;
        const page = path.split("/").pop();
        if (page === "chart_bar.html") {
            barChart.refreshDataset().then(() => barChart.generateChartBar());
        } else if (page === "chart_line.html") {
            lineChart.generateLineChart();
        } else {
            tableChart.refreshTableData().then(() => tableChart.generateTable());
        }
        removeCountryIds = [];
        createSortButtons();
    })
}

/**
 * This function's purpose is to deselect all countries filters.
 */
async function deselectAllCountries() {
    let labels;
    await getAllPossibleValuesOfFilterHTTPRequest('countries').then(result => {
        labels = result
        if (labels !== null) {
            for (let i = 0; i < labels.length; i++) {
                const checkbox = document.getElementById('country' + i);
                checkbox.type = 'checkbox';
                checkbox.checked = false;
            }
            window.sessionStorage.setItem("countries", '');
            let chart = getChart();
            if (chart === barChart) {
                barChart.clearChart();
                barChart.generateChartBar();
            } else if (chart === lineChart) {
                lineChart.generateLineChart();
            } else {
                tableChart.clearChart();
                tableChart.generateTable();
            }
            removeCountryIds = [...Array(labels.length).keys()];
        }
        createSortButtons();
    })
}

/**
 * This function's purpose is to remove a certain country from the chart for bar and table charts
 * @param id the id of the country of which will be removed from the graph
 */
function addOrRemoveCountryFromChart(id) {
    let chart = getChart();
    //if it exists in removeCountryIds
    if (removeCountryIds.includes(id)) {
        let index = removeCountryIds.indexOf(id);//delete it
        removeCountryIds.splice(index, 1);
        addDataToDatasetByCountryID(chart, id).then(() => {
                if (chart === barChart) {
                    barChart.generateChartBar();
                } else if (chart === tableChart) {
                    tableChart.generateTable();
                } else {
                    lineChart.generateLineChart();
                }
            }
        );
    } else {
        removeCountryIds.push(id);//else add it
        removeDataToDatasetByCountryID(chart, id).then(() => {
                if (chart === barChart) {
                    barChart.generateChartBar();
                } else if (chart === tableChart) {
                    tableChart.generateTable();
                } else {
                    lineChart.generateLineChart();
                }
            }
        );
    }
}

/**
 * This function's purpose is to add a country's data to the dataset based on it's id.
 * @param chart
 * @param id the id of the country
 */
async function addDataToDatasetByCountryID(chart, id) {
    let country;
    await getAllPossibleValuesOfFilterHTTPRequest('countries').then(async countriesArray => {
        country = countriesArray[id];
        window.sessionStorage.setItem("countries", window.sessionStorage.getItem("countries") + ',' + country);
        if (window.sessionStorage.getItem("countries")[0] === ',')
            window.sessionStorage.setItem("countries", window.sessionStorage.getItem("countries").slice(1));
        await getDataForCountriesHTTPRequest(country).then(
            result => {
                if (result !== null) {
                    chart.setDataset(result.dataset);
                } else {
                    chart.setDataset([]);
                }
            }
        ).catch(error => console.error(error));
        createSortButtons();
    });
}

/**
 * This function's purpose is to remove a country's data to the dataset based on it's id.
 * @param chart
 * @param id the id of the country
 */
async function removeDataToDatasetByCountryID(chart, id) {
    let country;
    await getAllPossibleValuesOfFilterHTTPRequest("countries").then(async countriesArray => {
        country = countriesArray[id];
        window.sessionStorage.setItem("countries", window.sessionStorage.getItem("countries").replaceAll(',' + country, ''));
        window.sessionStorage.setItem("countries", window.sessionStorage.getItem("countries").replaceAll(country, ''));

        if (window.sessionStorage.getItem("countries")[0] === ',')
            window.sessionStorage.setItem("countries", window.sessionStorage.getItem("countries").slice(1));

        const regExp = /(\s*[a-zA-Z]+\s*)+/g;
        if (regExp.test(window.sessionStorage.getItem("countries")) === false)
            window.sessionStorage.setItem("countries", '');

        await getDataForCountriesHTTPRequest(country).then(
            result => {
                if (result !== null) {
                    chart.setDataset(result.dataset);
                } else {
                    chart.setDataset([]);
                }
            }
        ).catch(error => console.error(error));

        if (chart === barChart) {
            barChart.generateChartBar();
        } else {
            if (chart === tableChart) {
                tableChart.removeCountry(country);
                tableChart.generateTableBody();
            } else {
                lineChart.generateLineChart();
            }
        }
        createSortButtons();
    });
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
