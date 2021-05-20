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
                removeCountryFromChart(i);
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

window.addEventListener("load", function () {
    createCountriesCheckboxes();
});
