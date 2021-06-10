function updateChart() {
    let chart = getChart();
    chart.refreshDataset().then(() => {
        if (chart === barChart) {
            barChart.generateChartBar();
        } else {
            if (chart === tableChart) {
                tableChart.generateTable();
            } else {
                lineChart.generateLineChart();
            }
        }
    });
}

/**
 * This function's purpose is to create a filter button CGI
 * @param fieldName
 * @param elementID the element id in html code
 * @param sessionStorageItemName the session storage item name to be set
 * @param append
 */
async function createFilterButton(fieldName, elementID, sessionStorageItemName, append = false) {
    const filtersContainer = document.getElementById(elementID);
    if (filtersContainer) {
        let indicatorsArray;
        await getAllPossibleValuesOfFilterHTTPRequest(fieldName).then(indicators => {
            indicatorsArray = indicators;
            filtersContainer.innerHTML = '';

            for (let i = 0; i < indicatorsArray.length; i++) {
                const newDiv = document.createElement('div');
                newDiv.className = "dropdown-btn";
                if (append === true) {
                    newDiv.onclick = function () {
                        if (window.sessionStorage.getItem(sessionStorageItemName).includes(indicatorsArray[i]) === false) {
                            window.sessionStorage.setItem(sessionStorageItemName, window.sessionStorage.getItem(sessionStorageItemName)
                                + ',' + indicatorsArray[i]);
                            if (window.sessionStorage.getItem(sessionStorageItemName)[0] === ',')
                                window.sessionStorage.setItem(sessionStorageItemName, window.sessionStorage.getItem(sessionStorageItemName).slice(1));
                        }
                        updateChart();
                    }
                } else {
                    newDiv.onclick = function () {
                        window.sessionStorage.setItem(sessionStorageItemName, indicatorsArray[i]);
                        updateChart();
                    }
                }
                newDiv.innerHTML = String(indicatorsArray[i]);
                filtersContainer.appendChild(newDiv);
            }
            window.sessionStorage.setItem(sessionStorageItemName, indicatorsArray[0]);
        }).catch(err => console.error(err));
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
            if (i === 0) {
                input.checked = true;
            }
            const label = document.createElement('label');
            label.innerHTML = indicatorsArray[i];
            label.setAttribute('for', indicatorsArray[i]);
            parent.appendChild(input);
            parent.appendChild(label);
            filtersContainer.appendChild(parent);
        }
        window.sessionStorage.setItem(localStorageItemName, indicatorsArray[0]);
    }
}

/**
 * This function's purpose is to create the filters based on the dataset used.
 */
async function refreshFilters() {
    window.sessionStorage.setItem("dataset", "eurostat"); //by default
    window.sessionStorage.setItem("BMIFilter", "pre_obese"); //by default
    await createFilterButton("BMIIndicators", "bodyMassButton", "BMIFilter", false);
    await createFilterButton("sexes", "sexButton", "SexFilter", true);
    await createFilterButton("regions", "continentButton", "RegionsFilter", false);
    await createRadioGroupButton("BMIIndicators", "bodyMassRadioButton", "BMIFilter");
    await createYearsCheckboxes();
    await createCountriesCheckboxes();
}

function changeDatasetSpanText(datasetName) {
    const span = document.getElementById("datasetName");
    if (datasetName === "who") {
        span.innerHTML = "Who";
        document.getElementById("eurostat").style.display = "none";
        document.getElementById("who").style.display = "block";
    }

    if (datasetName === "eurostat") {
        span.innerHTML = "Eurostat";
        document.getElementById("eurostat").style.display = "block";
        document.getElementById("who").style.display = "none";
    }
}


