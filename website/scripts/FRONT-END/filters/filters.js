function createFilterButton(HTTPRequestFunction, elementID, cookieName) {
    const indicatorsArray = HTTPRequestFunction(dataset);
    const filtersContainer = document.getElementById(elementID);
    filtersContainer.innerHTML = '';

    for (let i = 0; i < indicatorsArray.length; i++) {
        const newDiv = document.createElement('div');
        newDiv.className = "dropdown-btn";
        newDiv.onclick = function () {
            setCookie(cookieName, indicatorsArray[i]);
        }
        newDiv.innerHTML = String(indicatorsArray[i]);
        filtersContainer.appendChild(newDiv);
    }
    setCookie(cookieName, indicatorsArray[0]);
}

function refreshFilters() {
    createFilterButton(getBMIFiltersHTTPRequest, "bodyMassButton", "BMIFilter");
    createFilterButton(getYearsFiltersHTTPRequest, "yearsButton", "YearsFilter");
    createFilterButton(getSexFiltersHTTPRequest, "sexButton", "SexFilter");
    createFilterButton(getRegionsFiltersHTTPRequest, "continentButton", "RegionsFilter");
}

window.addEventListener("load", function () {
    refreshFilters();
});

