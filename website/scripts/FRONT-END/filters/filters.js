/**
 * This function's purpose is to create a filter button CGI
 * @param fieldName
 * @param elementID the element id in html code
 * @param localStorageItemName the cookie to be set
 */
function createFilterButton(fieldName, elementID, localStorageItemName) {
    const indicatorsArray = getAllPossibleValuesOfFilterHTTPRequest(fieldName);
    const filtersContainer = document.getElementById(elementID);
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

/**
 * This function's purpose is to create the filters based on the dataset used.
 */
function refreshFilters() {
    createFilterButton("BMIIndicators", "bodyMassButton", "BMIFilter");
    createFilterButton("years", "sexButton", "SexFilter");
    createFilterButton("regions", "continentButton", "RegionsFilter");
    createYearsCheckboxes();
    createCountriesCheckboxes();
}

window.addEventListener("load", function () {
    refreshFilters();
});

