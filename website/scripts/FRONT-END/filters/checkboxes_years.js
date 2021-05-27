let removedYearsIds = [];
let currentYearCheckboxId = 0;

/**
 * This function's purpose is to create the checkboxes for the years
 */
function createYearsCheckboxes() {
    let years = getYearsHTTPRequest();
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
function selectAllYears() {
    let years = getYearsHTTPRequest();
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
        const chart = getBarChart();
        //TODO update bar chart configuration
    } else {
        const tableData = getTableData();
        //TODO update table columns
    }

    if (page === "chart_bar.html") {
        chart.update();
    } else {
        refreshTableData();
        generateTable();
    }

    removedYearsIds = [];
    window.localStorage.setItem("years", localStorageYears);
}

/**
 * This function's purpose is to deselect all years filters.
 */
function deselectAllYears() {
    let years = getYearsHTTPRequest();
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
            const chart = getBarChart();
            //refresh bar chart configuration
            chart.update();

        } else {
            //refresh table's columns
            generateTable();
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
        refreshBarChartData();
        getBarChart().update();
    } else {
        refreshTableData();
        generateTable();
    }
}

/**
 * This function's purpose is to add a year's data to the dataset based on it's id.
 * @param id the id of the year
 */
function addYearToActiveYearsByID(id) {
    //TODO
    let year = getYearsHTTPRequest()[id];
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
function removeYearFromActiveYearsByID(id) {
    //TODO
    let year = getYearsHTTPRequest()[id];
    window.localStorage.setItem("years", window.localStorage.getItem("years").replaceAll(year, ''));
    window.localStorage.setItem("years", window.localStorage.getItem("years").replaceAll("  ", ' '));
    const regExp = /(\s*[0-9]+\s*)+/g;
    if (regExp.test(window.localStorage.getItem("years")) === false)
        window.localStorage.setItem("years", "none");
}
