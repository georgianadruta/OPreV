let tableData = {
    labels: getDatasetLabels(),
    data: getDatasetData(),
}

function refreshTableData() {
    tableData.labels = getDatasetLabels();
    tableData.data = getDatasetData();
}

function getTableData() {
    return tableData;
}

function generateTable() {
    const table = document.getElementById("table");
    table.innerHTML = '';

    if (tableData.data.length >= 1) {
        for (let i = 0; i < tableData.labels.length; i++) {
            let tr = table.insertRow(-1);
            tr.id = 'country-' + i;

            const thLabel = document.createElement("td");
            thLabel.innerHTML = tableData.labels[i];
            tr.appendChild(thLabel);

            const th2008 = document.createElement("td");
            th2008.innerHTML = tableData.data[0][i] + '';
            tr.appendChild(th2008);

            const th2014 = document.createElement("td");
            th2014.innerHTML = tableData.data[1][i] + '';
            tr.appendChild(th2014);

            const th2017 = document.createElement("td");
            th2017.innerHTML = tableData.data[1][i] + '';
            tr.appendChild(th2017);

            table.appendChild(tr);
        }
    }
}

// window.onload = function () {
//     generateTable();
// }


