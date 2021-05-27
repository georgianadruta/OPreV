let tableInformation = {
    tableColumns: Array(),
    dataset: Array(),
}

function getTableData() {
    return tableInformation.dataset;
}

async function refreshTableData() {
    await getDatasetHTTPRequest().then(data => {
        tableInformation = data;
    }).catch(fail => {
        console.error(fail);
    });
}

/**
 * TODO GEORGIANA
 */
async function generateTable() {
    await getDatasetHTTPRequest().then(result => {
        tableInformation = result
    }).catch(err => console.error(err))
    const table = document.getElementById("table");
    table.innerHTML = '';

    if (tableInformation.dataset.length > 0) {
        for (let i = 0; i < tableInformation.dataset.length - 3; i = i + 3) {
            let tr = table.insertRow(-1);
            tr.id = 'country-' + i;

            const thLabel = document.createElement("td");
            thLabel.innerHTML = tableInformation.dataset[i].country;
            tr.appendChild(thLabel);

            const th2008 = document.createElement("td");
            th2008.innerHTML = tableInformation.dataset[i].BMI_value + '';
            tr.appendChild(th2008);

            const th2014 = document.createElement("td");
            th2014.innerHTML = tableInformation.dataset[i + 1].BMI_value + '';
            tr.appendChild(th2014);

            const th2017 = document.createElement("td");
            th2017.innerHTML = tableInformation.dataset[i + 2].BMI_value + '';
            tr.appendChild(th2017);

            table.appendChild(tr);
        }
    }
}

/**
 * TODO TEST IF IT WORKS
 * helpful method to delete columns from table
 */
function deleteColumn(name) {
    let tble = document.getElementById('tbl');
    let row = tble.rows;
    for (let i = 0; i < row[0].cells.length; i++) {
        let str = row[0].cells[i].innerHTML;
        if (str.search(name) !== -1) {
            for (let j = 0; j < row.length; j++) {
                row[j].deleteCell(i);
            }
        }
    }
}