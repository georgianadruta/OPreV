/**
 * This function's purpose is to create a filter button CGI
 * @param HTTPRequestFunction the function that will return the text to be added
 * @param elementID the element id in html code
 * @param cookieName the cookie to be set
 */
function createFilterButton(HTTPRequestFunction, elementID, cookieName) {
    const indicatorsArray = HTTPRequestFunction(dataset);
    const filtersContainer = document.getElementById(elementID);
    filtersContainer.innerHTML = '';

    for (let i = 0; i < indicatorsArray.length; i++) {
        const newDiv = document.createElement('div');
        newDiv.className = "dropdown-btn";
        newDiv.onclick = function () {
            window.localStorage.setItem(cookieName, indicatorsArray[i]);
        }
        newDiv.innerHTML = String(indicatorsArray[i]);
        filtersContainer.appendChild(newDiv);
    }
    window.localStorage.setItem(cookieName, indicatorsArray[0]);
}

/**
 * This function's purpose is to create the filters based on the dataset used.
 */
function refreshFilters() {
    createFilterButton(getBMIFiltersHTTPRequest, "bodyMassButton", "BMIFilter");
    createFilterButton(getSexFiltersHTTPRequest, "sexButton", "SexFilter");
    createFilterButton(getRegionsFiltersHTTPRequest, "continentButton", "RegionsFilter");
    createYearsCheckboxes();
    createCountriesCheckboxes();
}

window.addEventListener("load", function () {
    refreshFilters();
});

