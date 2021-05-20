/**
 * This function's purpose is to create the checkboxes for the countries
 */
function createCountriesCheckboxes() {
    const container = document.getElementById('countries');
    for (let i = 0; i < labels.length; i++) {
        const parent = document.createElement('div');
        parent.className = 'country';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'country' + i;
        checkbox.name = labels[i];
        checkbox.value = labels[i];
        checkbox.checked = true;
        checkbox.onclick = function () {
            removeFromChart(i)
        };

        const label = document.createElement('label');
        label.htmlFor = 'country' + i;
        label.appendChild(document.createTextNode(labels[i]));

        parent.appendChild(checkbox);
        parent.appendChild(label);

        container.appendChild(parent);
    }
}

window.addEventListener("load", function (event) {
    createCountriesCheckboxes();
});
