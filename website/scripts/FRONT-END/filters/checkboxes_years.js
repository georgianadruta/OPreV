let removedYearsIds = [];
let currentYearCheckboxId = 0;

/**
 * This function's purpose is to create the checkboxes for the years
 */
function createYearsCheckboxes() {
    let years = getYearsFiltersHTTPRequest();
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
}

/**
 * This function's purpose is to select all years filters.
 */
function selectAllYears() {
    let years = getYearsFiltersHTTPRequest();
    //tick all boxes
    for (let i = 0; i < years.length; i++) {
        const checkbox = document.getElementById('year' + i);
        checkbox.type = 'checkbox';
        checkbox.checked = true;
    }


    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "chart_bar.html") {
        const chart = getBarChart();
        //update bar chart configuration
    } else {
        const tableData = getTableData();
        //update table columns
    }

    if (page === "chart_bar.html") {
        chart.update();
    } else {
        refreshTableData();
        generateTable();
    }

    removedYearsIds = [];
    setCookie("years", "all");
}

/**
 * This function's purpose is to deselect all years filters.
 */
function deselectAllYears() {
    let years = getYearsFiltersHTTPRequest();
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
    setCookie("years", "none");
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
}

/**
 * This function's purpose is to remove a year's data to the dataset based on it's id.
 * @param id the id of the year
 */
function removeYearFromActiveYearsByID(id) {
    //TODO
}

window.addEventListener("load", function () {
    createYearsCheckboxes();
});