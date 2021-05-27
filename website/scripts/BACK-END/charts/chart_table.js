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
function generateTable() {
    const table = document.getElementById("table");
    table.innerHTML = '';

    if (tableInformation.dataset.length > 0) {
        for (let i = 1; i < tableInformation.tableColumns.length; i++) {
            let tr = table.insertRow(-1);
            tr.id = 'country-' + i;

            const thLabel = document.createElement("td");
            thLabel.innerHTML = tableInformation.tableColumns[i];
            tr.appendChild(thLabel);

            const th2008 = document.createElement("td");
            th2008.innerHTML = tableInformation.dataset[0][i] + '';
            tr.appendChild(th2008);

            const th2014 = document.createElement("td");
            th2014.innerHTML = tableInformation.dataset[1][i] + '';
            tr.appendChild(th2014);

            const th2017 = document.createElement("td");
            th2017.innerHTML = tableInformation.dataset[1][i] + '';
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