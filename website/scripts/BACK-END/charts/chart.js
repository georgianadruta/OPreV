/**
 * This function's purpose is to select all countries filters.
 */
function selectAllCountries() {
    for (let i = 0; i < labels.length; i++) {
        const checkbox = document.getElementById('country' + i);
        checkbox.type = 'checkbox';
        checkbox.checked = true;
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = dataset2008;
    chart.data.datasets[1].data = dataset2014;
    chart.data.datasets[2].data = dataset2017;
    chart.update();
    removeCountryIds = [];

    setCookie("countries", "all");
}

/**
 * This function's purpose is to deselect all countries filters.
 */
function deselectAllCountries() {
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

    setCookie("countries", "none");
}

function removeFromChart(id) {
    if (removeCountryIds.includes(id)) {
        let index = removeCountryIds.indexOf(id);
        removeCountryIds.splice(index, 1);
    } else {
        removeCountryIds.push(id);
    }

    let labelsCopy = [...labels];
    let dataset2008Copy = [...dataset2008];
    let dataset2014Copy = [...dataset2014];
    let dataset2017Copy = [...dataset2017];

    for (let i = 0; i < removeCountryIds.length; i++) {
        labelsCopy[removeCountryIds[i]] = undefined;
        dataset2008Copy[removeCountryIds[i]] = undefined;
        dataset2014Copy[removeCountryIds[i]] = undefined;
        dataset2017Copy[removeCountryIds[i]] = undefined;
    }

    chart.data.labels = labelsCopy.filter(x => x !== undefined);
    chart.data.datasets[0].data = dataset2008Copy.filter(x => x !== undefined);
    chart.data.datasets[1].data = dataset2014Copy.filter(x => x !== undefined);
    chart.data.datasets[2].data = dataset2017Copy.filter(x => x !== undefined);
    chart.update();
}

window.addEventListener("load", function (event) {
    selectAllCountries();
});

