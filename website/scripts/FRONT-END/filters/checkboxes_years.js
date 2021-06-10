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

            removedYearsIds.push(i);

            let chart = getChart();
            if (chart === barChart) {
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

        let chart = getChart();
        if (chart === barChart) {
            barChart.getChart().update();
        } else if (chart === lineChart) {
            lineChart.getChart().update();
        } else {
            tableChart.generateTable();
        }
        removedYearsIds = [];
        createSortButtons();
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
            //TODO remove years from charts

            let chart = getChart();
            if (chart === barChart) {

            } else if (chart === lineChart) {

            } else {
                tableChart.generateTable();
                deselectAllCountries();
            }
            removedYearsIds = [...Array(years.length).keys()];
        }
        createSortButtons();
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
    let chart = getChart();
    //if it exists in removeCountryIds
    if (removedYearsIds.includes(id)) {
        let index = removedYearsIds.indexOf(id);//delete it
        removedYearsIds.splice(index, 1);
        addYearToActiveYearsByID(chart, id).then(async () => {
            if (chart === barChart) {
                //TODO
            } else {
                if (chart === lineChart) {
                    //TODO
                } else {
                    tableChart.generateTable();
                }
            }
        });
    } else {
        removedYearsIds.push(id);//else add it
        removeYearFromActiveYearsByID(chart, id).then(() => {
            if (chart === barChart) {
                //TODO
            } else {
                if (chart === lineChart) {
                    //TODO
                } else {
                    tableChart.generateTable();
                }
            }
        });
    }
}

/**
 * This function's purpose is to add a year's data to the dataset based on it's id.
 * @param chart
 * @param id the id of the year
 */
async function addYearToActiveYearsByID(chart, id) {
    await getAllPossibleValuesOfFilterHTTPRequest('years').then(async yearsArray => {
        let year = yearsArray[id];
        window.sessionStorage.setItem("years", window.sessionStorage.getItem("years") + ',' + year);
        if (window.sessionStorage.getItem("years")[0] === ',')
            window.sessionStorage.setItem("years", window.sessionStorage.getItem("years").slice(1));
        let chartDataset = chart.getDataset();
        await getDataForYearsHTTPRequest(year).then(
            result => {
                if (result != null)
                    if (result.dataset !== null) {
                        chartDataset.push(...result.dataset);
                    }
            }
        ).catch(error => console.error(error));
        createSortButtons();
    });
}

/**
 * This function's purpose is to remove a year's data to the dataset based on it's id.
 * @param chart
 * @param id the id of the year
 */
async function removeYearFromActiveYearsByID(chart, id) {
    let year;
    await getAllPossibleValuesOfFilterHTTPRequest("years").then(yearsArray => {
        year = yearsArray[id];
        window.sessionStorage.setItem("years", window.sessionStorage.getItem("years").replaceAll(',' + year, ''));
        window.sessionStorage.setItem("years", window.sessionStorage.getItem("years").replaceAll(year, ''));

        if (window.sessionStorage.getItem("years")[0] === ',')
            window.sessionStorage.setItem("years", window.sessionStorage.getItem("years").slice(1));

        const regExp = /(\s*[0-9]+\s*)+/g;
        if (regExp.test(window.sessionStorage.getItem("years")) === false)
            window.sessionStorage.setItem("years", '');
        if (chart === barChart) {

        } else {
            if (chart === tableChart) {
                tableChart.removeYear(year);
                tableChart.generateTableBody();
            } else {

            }
        }
        createSortButtons();
    }).catch(err => {
        console.error(err);
    })
}