let removedYearsIds = [];
let currentYearCheckboxId = 0;

/**
 * This function's purpose is to create the checkboxes for the years
 */
async function createYearsCheckboxes() {
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(yearsArray => {
        years = yearsArray;
        const container = document.getElementById('yearsCheckboxContainer');
        container.innerHTML = '';//clear content
        for (let i = 0; i < years.length; i++) {
            const parent = document.createElement('div');
            parent.className = 'year';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'year' + i;
            checkbox.name = 'years';
            checkbox.value = years[i];
            checkbox.checked = false;

            const path = window.location.pathname;
            const page = path.split("/").pop();
            if (page === "chart_bar.html") {
                checkbox.checked = true;
            } else {
                checkbox.onclick = function () {
                    addOrRemoveYearFromChart(i);
                }
            }

            const label = document.createElement('label');
            label.htmlFor = 'year' + i;
            label.appendChild(document.createTextNode(years[i]));

            parent.appendChild(checkbox);
            parent.appendChild(label);

            container.appendChild(parent);
        }
        window.sessionStorage.setItem('years', '');
    }).catch(err => {
        console.error(err);
    })
}

/**
 * This function's purpose is to select all years filters.
 */
async function selectAllYears() {
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(yearsArray => {
        years = yearsArray;
        let sessionStorageYears = String();
        //tick all boxes
        for (let i = 0; i < years.length; i++) {
            const checkbox = document.getElementById('year' + i);
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            sessionStorageYears += years[i] + ',';
        }
        sessionStorageYears = sessionStorageYears.slice(0, -1);

        window.sessionStorage.setItem("years", sessionStorageYears);

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
            tableChart.generateTable();
        }
        removedYearsIds = [];
    }).catch(err => {
        console.error(err);
    })
}

/**
 * This function's purpose is to deselect all years filters.
 */
async function deselectAllYears() {
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(yearsArray => {
        years = yearsArray;
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
                // const chart = barChart.getChart();
                //refresh bar chart configuration
                // chart.update();
            } else if (page === "chart_line.html") {
                const chart = lineChart.getChart();
                //refresh bar chart configuration
                chart.update();
            } else {
                // TODO update for table chart
            }
            removedYearsIds = [...Array(years.length).keys()];
        }
        window.sessionStorage.setItem("years", '');
    }).catch(err => {
        console.error(err);
    })
}

/**
 * This function's purpose is to remove a certain year from the chart for bar and table charts
 * @param id the id of the year of which will be removed from the graph
 */
function addOrRemoveYearFromChart(id) {
    let chart;
    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "chart_bar.html") {
        chart = barChart;
    } else if (page === "chart_line.html") {
        chart = lineChart;
    } else {
        chart = tableChart;
    }
    //if it exists in removeCountryIds
    if (removedYearsIds.includes(id)) {
        let index = removedYearsIds.indexOf(id);//delete it
        removedYearsIds.splice(index, 1);
        removeYearFromActiveYearsByID(chart, id).then(() => {
            const path = window.location.pathname;
            const page = path.split("/").pop();
            if (page === "chart_bar.html") {
                //TODO
            } else {
                //TODO
                tableChart.generateTable();
            }
        });
    } else {
        removedYearsIds.push(id);//else add it
        addYearToActiveYearsByID(chart, id).then(() => {
            const path = window.location.pathname;
            const page = path.split("/").pop();
            if (page === "chart_bar.html") {
                //TODO
            } else {
                //TODO
                tableChart.generateTable();
            }
        });
    }
}

/**
 * This function's purpose is to add a year's data to the dataset based on it's id.
 * @param id the id of the year
 */
async function addYearToActiveYearsByID(chart, id) {
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(async yearsArray => {
        years = yearsArray;
        let year = years[id];
        if (window.sessionStorage.getItem("years").includes(year) === false) {
            window.sessionStorage.setItem("years", window.sessionStorage.getItem("years") + ',' + year);
            if (window.sessionStorage.getItem("years")[0] === ',')
                window.sessionStorage.setItem("years", window.sessionStorage.getItem("years").slice(1));
        }
        let chartDataset = chart.getDataset();
        await getDataForYearsHTTPRequest(year).then(
            result => {
                chartDataset.push(...result.dataset);
            }
        ).catch(error => console.error(error));
    }).catch(err => {
        console.error(err);
    })
}

/**
 * This function's purpose is to remove a year's data to the dataset based on it's id.
 * @param id the id of the year
 */
async function removeYearFromActiveYearsByID(chart, id) {
    let years;
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(yearsArray => {
        years = yearsArray;
        let year = years[id];
        window.sessionStorage.setItem("years", window.sessionStorage.getItem("years").replaceAll(',' + year, ''));
        window.sessionStorage.setItem("years", window.sessionStorage.getItem("years").replaceAll(year, ''));
        if (window.sessionStorage.getItem("years")[0] === ',')
            window.sessionStorage.setItem("years", window.sessionStorage.getItem("years").slice(1));

        const regExp = /(\s*[0-9]+\s*)+/g;
        if (regExp.test(window.sessionStorage.getItem("years")) === false)
            window.sessionStorage.setItem("years", '');
    }).catch(err => {
        console.error(err);
    })
}