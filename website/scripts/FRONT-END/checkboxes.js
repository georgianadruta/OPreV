let currentCheckboxId = 0;

/**
 * This function's purpose is to create the checkboxes for the countries
 */
function createCountriesCheckboxes() {
    let labels = getLabelsHTTPRequest();
    const container = document.getElementById('countries');
    for (let i = 0; i < labels.length; i++) {
        const parent = document.createElement('div');
        parent.className = 'country';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'country' + i;
        checkbox.name = labels[i];
        checkbox.value = labels[i];
        checkbox.checked = false;

        const path = window.location.pathname;
        const page = path.split("/").pop();
        if (page === "chart_line.html") {
            checkbox.onclick = function () {
                selectOnlyOneCountryFromChart(i);
            };
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
    } else {
        const tableData = getTableData();
        tableData.labels = labels;
        tableData.data[0] = getDatasetData()[0];
        tableData.data[1] = getDatasetData()[1];
        tableData.data[2] = getDatasetData()[2];
    }

    if (page === "chart_bar.html") {
        chart.update();
    } else {
        refreshTableData();
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
        const path = window.location.pathname;
        const page = path.split("/").pop();
        if (page === "chart_bar.html") {
            const chart = getBarChart();
            chart.data.labels = [];
            chart.data.datasets[0].data = [];
            chart.data.datasets[1].data = [];
            chart.data.datasets[2].data = [];
            chart.update();

        } else {
            const tableData = getTableData();
            tableData.data = [];
            generateTable();
        }
        removeCountryIds = [...Array(labels.length).keys()];
    }
    setCookie("countries", "none");
}

//TODO fix bug after removing one country sometimes it gets bugged on table
/**
 * This function's purpose is to remove a certain country from the chart for bar and table charts
 * @param id the id of the country of which will be removed from the graph
 */
function addOrRemoveCountryFromChart(id) {
    //if it exists in removeCountryIds
    if (removeCountryIds.includes(id)) {
        let index = removeCountryIds.indexOf(id);//delete it
        removeCountryIds.splice(index, 1);
    } else {
        removeCountryIds.push(id);//else add it
    }

    //reconstruct dataset
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

    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "chart_bar.html") {
        const chart = getBarChart();
        chart.data.labels = labelsCopy.filter(x => x !== undefined);
        chart.data.datasets[0].data = dataset1Copy.filter(x => x !== undefined);
        chart.data.datasets[1].data = dataset2Copy.filter(x => x !== undefined);
        chart.data.datasets[2].data = dataset3Copy.filter(x => x !== undefined);
        chart.update();
    } else {
        const tableData = getTableData();
        tableData.labels = labelsCopy.filter(x => x !== undefined);
        tableData.data[0] = dataset1Copy.filter(x => x !== undefined);
        tableData.data[1] = dataset2Copy.filter(x => x !== undefined);
        tableData.data[2] = dataset3Copy.filter(x => x !== undefined);
        generateTable();
    }

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

window.addEventListener("load", function () {
    createCountriesCheckboxes();
});