let removedYearsIds = [];
let currentYearCheckboxId = 0;

/**
 * This function's purpose is to create the checkboxes for the years
 */
async function createYearsCheckboxes() {
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(yearsArray => {
        years = yearsArray;
    }).catch(err => {
        console.error(err);
    })

    const container = document.getElementById('yearsCheckboxContainer');
    container.innerHTML = '';//clear content
    for (let i = 0; i < years.length; i++) {
        const parent = document.createElement('div');
        parent.className = 'year';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'year' + i;
        checkbox.name = years[i];
        checkbox.value = years[i];
        checkbox.checked = false;

        removedYearsIds.push(i);//by default all are removed

        checkbox.onclick = function () {
            addOrRemoveYearFromChart(i);
        }

        const label = document.createElement('label');
        label.htmlFor = 'year' + i;
        label.appendChild(document.createTextNode(years[i]));

        parent.appendChild(checkbox);
        parent.appendChild(label);

        container.appendChild(parent);
    }
    window.localStorage.setItem('years', 'none');
}

/**
 * This function's purpose is to select all years filters.
 */
async function selectAllYears() {
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(yearsArray => {
        years = yearsArray;
    }).catch(err => {
        console.error(err);
    })
    let localStorageYears = String();
    //tick all boxes
    for (let i = 0; i < years.length; i++) {
        const checkbox = document.getElementById('year' + i);
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        localStorageYears += years[i] + ' ';
    }
    localStorageYears = localStorageYears.slice(0, -1);

    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "chart_bar.html") {
        const chart = barChart.getChart();
        //TODO update bar chart configuration
    } else if (page === "chart_line.html") {
        const chart = lineChart.getChart();
        //TODO update line chart configuration
    } else {
        const tableData = tableChart.getTableData();
        //TODO update table columns
    }

    if (page === "chart_bar.html") {
        barChart.getChart().update();
    } else if (page === "chart_line.html") {
        lineChart.getChart().update();
    } else {
        tableChart.refreshTableData();
        tableChart.generateTable();
    }

    removedYearsIds = [];
    window.localStorage.setItem("years", localStorageYears);
}

/**
 * This function's purpose is to deselect all years filters.
 */
async function deselectAllYears() {
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(yearsArray => {
        years = yearsArray;
    }).catch(err => {
        console.error(err);
    })
    if (years !== null) {
        for (let i = 0; i < years.length; i++) {
            const checkbox = document.getElementById('year' + i);
            checkbox.type = 'checkbox';
            checkbox.checked = false;
        }
        //TODO remove years from charts/tables

        const path = window.location.pathname;
        const page = path.split("/").pop();
        if (page === "chart_bar.html") {
            const chart = barChart.getChart();
            //refresh bar chart configuration
            chart.update();
        } else if (page === "chart_line.html") {
            const chart = lineChart.getChart();
            //refresh bar chart configuration
            chart.update();
        } else {
            //refresh table's columns
            tableChart.generateTable();
        }
        removedYearsIds = [...Array(years.length).keys()];
    }
    window.localStorage.setItem("years", "none");
}

/**
 * This function's purpose is to remove a certain year from the chart for bar and table charts
 * @param id the id of the year of which will be removed from the graph
 */
function addOrRemoveYearFromChart(id) {
    //if it exists in removeCountryIds
    if (removedYearsIds.includes(id)) {
        let index = removedYearsIds.indexOf(id);//delete it
        removedYearsIds.splice(index, 1);
        addYearToActiveYearsByID(id);
    } else {
        removedYearsIds.push(id);//else add it
        removeYearFromActiveYearsByID(id);
    }

    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "chart_bar.html") {
        barChart.refreshChartData();
        barChart.getChart().update();
    } else {
        tableChart.refreshTableData();
        tableChart.generateTable();
    }
}

/**
 * This function's purpose is to add a year's data to the dataset based on it's id.
 * @param id the id of the year
 */
async function addYearToActiveYearsByID(id) {
    //TODO
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(yearsArray => {
        years = yearsArray;
    }).catch(err => {
        console.error(err);
    })
    let year = years[id];
    let delimiter = ' ';
    if (window.localStorage.getItem("years").search("none") !== -1) {
        window.localStorage.setItem("years", '');
        delimiter = '';
    }
    window.localStorage.setItem("years", window.localStorage.getItem("years") + delimiter + year);
}

/**
 * This function's purpose is to remove a year's data to the dataset based on it's id.
 * @param id the id of the year
 */
async function removeYearFromActiveYearsByID(id) {
    //TODO
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(yearsArray => {
        years = yearsArray;
    }).catch(err => {
        console.error(err);
    })
    let year = years[id];
    window.localStorage.setItem("years", window.localStorage.getItem("years").replaceAll(year, ''));
    window.localStorage.setItem("years", window.localStorage.getItem("years").replaceAll("  ", ' '));
    const regExp = /(\s*[0-9]+\s*)+/g;
    if (regExp.test(window.localStorage.getItem("years")) === false)
        window.localStorage.setItem("years", "none");
}