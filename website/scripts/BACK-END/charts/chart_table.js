class TableChart extends OPreVChart {
    constructor() {
        super();
        this.generateTable();
    }

    getTableData() {
        return this.tableInformation.dataset;
    }

    async refreshTableData() {
        await getDatasetHTTPRequest().then(data => {
            this.tableInformation = data;
        }).catch(fail => {
            console.error(fail);
        });
    }

    /**
     * This function's purpose is to create the table head based on session storage.
     */
    generateTableHead() {
        const tableHeadRow = document.getElementById("table-head-row");
        tableHeadRow.innerHTML = '';
        let data = window.sessionStorage.getItem("years");
        let sessionStorageArray;
        if (data.indexOf(',') !== -1) {
            sessionStorageArray = data.split(',');
        } else {
            sessionStorageArray = Array(data);
        }
        sessionStorageArray.sort();
        if (sessionStorageArray[0].length > 0) {
            let th = document.createElement("th");
            th.textContent = "Country";
            tableHeadRow.append(th);
            sessionStorageArray.forEach(year => {
                let th = document.createElement("th");
                th.textContent = year;
                tableHeadRow.append(th);
            })
        }
    }

    /**
     * This function's purpose is to create the table based on data base (now euroStat).
     */
    generateTable() {
        this.generateTableHead();
        this.sortDataset("country");
        let data = window.sessionStorage.getItem("years");
        let sessionStorageArray;
        if (data.indexOf(',') !== -1) {
            sessionStorageArray = data.split(',');
        } else {
            sessionStorageArray = Array(data);
        }

        let tableBody = document.getElementById("table-body");
        tableBody.innerHTML = '';
        let alreadyCreatedCountriesRows = Array();
        this.tableInformation.dataset.forEach(rowJson => {
            if (!alreadyCreatedCountriesRows.includes(rowJson.country)) {
                alreadyCreatedCountriesRows.push(rowJson.country);

                let tr = document.createElement("tr");

                let td = document.createElement("td");
                td.id = "country=" + rowJson.country;
                tr.append(td);
                sessionStorageArray.forEach(year => {
                    let td = document.createElement("td");
                    td.id = rowJson.country + ":" + year;
                    tr.append(td);
                });
                tableBody.append(tr);
            }
        });

        this.tableInformation.dataset.forEach(rowJson => {
            let country = rowJson.country;
            let year = rowJson.year;
            let BMIValue = rowJson.BMI_value;
            document.getElementById(country + ':' + year).textContent = BMIValue;
            document.getElementById('country=' + country).textContent = country;
        });
    }

    /**
     * This function's purpose it to sort the data set ascending by default.
     * @param fieldName
     * @param asc
     */
    sortDataset(fieldName, asc = true) {
        this.tableInformation.dataset.sort((a, b) => {
            return ((asc === true) ? (a[fieldName].localeCompare(b[fieldName])) : (b[fieldName].localeCompare(a[fieldName])));
        });
    }

    /**
     * This function's purpose is to delete the selected columns.
     */
    deleteColumn(name) {
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
}

let chart;
window.addEventListener("load", () => {
    refreshFilters().then(() => {
        tableChart = chart = new TableChart();
    });
})
