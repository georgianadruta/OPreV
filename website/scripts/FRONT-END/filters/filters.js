/**
 * This function's purpose is to create a filter button CGI
 * @param fieldName
 * @param elementID the element id in html code
 * @param localStorageItemName the cookie to be set
 */
async function createFilterButton(fieldName, elementID, localStorageItemName) {
    const filtersContainer = document.getElementById(elementID);
    if (filtersContainer) {
        let indicatorsArray;
        await getAllPossibleValuesOfFilterHTTPRequest(fieldName).then(indicators => {
            indicatorsArray = indicators
        }).catch(err => console.error(err));
        filtersContainer.innerHTML = '';

        for (let i = 0; i < indicatorsArray.length; i++) {
            const newDiv = document.createElement('div');
            newDiv.className = "dropdown-btn";
            newDiv.onclick = function () {
                window.localStorage.setItem(localStorageItemName, indicatorsArray[i]);
            }
            newDiv.innerHTML = String(indicatorsArray[i]);
            filtersContainer.appendChild(newDiv);
        }
        window.localStorage.setItem(localStorageItemName, indicatorsArray[0]);
    }
}

/**
 * This function's purpose is to create a filter button CGI
 * @param fieldName
 * @param elementID the element id in html code
 * @param localStorageItemName the cookie to be set
 */
async function createRadioGroupButton(fieldName, elementID, localStorageItemName) {
    const filtersContainer = document.getElementById(elementID);
    if (filtersContainer) {
        let indicatorsArray;
        await getAllPossibleValuesOfFilterHTTPRequest(fieldName).then(indicators => {
            indicatorsArray = indicators
        }).catch(err => console.error(err));
        filtersContainer.innerHTML = '';
        for (let i = 0; i < indicatorsArray.length; i++) {
            const parent = document.createElement('div');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = elementID;
            input.value = indicatorsArray[i];
            input.id = indicatorsArray[i];
            if (i == 0) {
                input.checked = true;
            }
            const label = document.createElement('label');
            label.innerHTML = indicatorsArray[i];
            label.setAttribute('for', indicatorsArray[i]);
            parent.appendChild(input);
            parent.appendChild(label);
            filtersContainer.appendChild(parent);
        }
        window.localStorage.setItem(localStorageItemName, indicatorsArray[0]);
    }
}

/**
 * This function's purpose is to create the filters based on the dataset used.
 */
function refreshFilters() {
    createFilterButton("BMIIndicators", "bodyMassButton", "BMIFilter");
    createFilterButton("sexes", "sexButton", "SexFilter");
    createFilterButton("regions", "continentButton", "RegionsFilter");

    createRadioGroupButton("BMIIndicators", "bodyMassRadioButton", "BMIFilter");

    createYearsCheckboxes();
    createCountriesCheckboxes();
}

function changeDataset(datasetName) {
    const span = document.getElementById("datasetName");
    if (datasetName == "who") {
        span.innerHTML = "Who";
        document.getElementById("eurostat").style.display = "none";
        document.getElementById("who").style.display = "block";
    }

    if (datasetName == "eurostat") {
        span.innerHTML = "Eurostat";
        document.getElementById("eurostat").style.display = "block";
        document.getElementById("who").style.display = "none";
    }
    loadDataSet(datasetName);
}

async function applyAllFilters() {
    let bodyMass = '', years = [], countries = [];

    let bodyMassContainer = document.getElementsByName('bodyMassRadioButton');
    for (let i = 0; i < bodyMassContainer.length; i++) {
        if (bodyMassContainer[i].checked) {
            bodyMass = bodyMassContainer[i].value;
            break;
        }
    }

    let yearsContainer = document.getElementsByName('years');
    for (let i = 0; i < yearsContainer.length; i++) {
        if (yearsContainer[i].checked) {
            years.push(yearsContainer[i].value);
        }
    }

    let countriesContainer = document.getElementsByName('countries');
    for (let i = 0; i < countriesContainer.length; i++) {
        if (countriesContainer[i].checked) {
            countries.push(countriesContainer[i].value);
        }
    }

    let filter = {
        mass: bodyMass,
        years: years,
        countries: countries
    }

    let result;

    await getDatasetHTTPRequest(filter).then(res => {
        result = res;
    }).catch(err => console.error(err));

    return result;
}

function updateChart() {
    applyAllFilters().then(result => {
        const chart = barChart.getChart();
        const chartData = barChart.getChartData();

        chartData.labels = result.labels;
        for (let i = 0; i < Object.keys(result.years).length; i++) {
            chartData.datasets[i]['data'] = result.years[Object.keys(result.years)[i]].map(x => x.BMI_value);
        }
        chart.update();
    }).catch(err => {
        console.log(err)
    })
}

/**
 * @return {Promise<>} a new Promise
 * @param request
 */
async function getDatasetHTTPRequest(request) {
    return await new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        const url = '/dataset';
        HTTP.onreadystatechange = () => {
            if (HTTP.readyState === HTTP.DONE) {
                if (HTTP.status >= 400) {
                    console.log(HTTP.responseText);
                    reject();
                } else {
                    let data = JSON.parse(HTTP.responseText);
                    resolve(data);
                }
            }
        }
        HTTP.open("POST", url, true);
        HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        HTTP.send(JSON.stringify(request));
    })
}

window.addEventListener("load", function () {
    refreshFilters();
});

