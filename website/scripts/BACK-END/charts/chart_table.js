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
            console.log(rowJson);
            if (!alreadyCreatedCountriesRows.includes(rowJson.country)) {
                alreadyCreatedCountriesRows.push(rowJson.country);
                let tr = document.createElement("tr");
                tr.id = "country=" + rowJson.country;
            }
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
