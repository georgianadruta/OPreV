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
     * This function's purpose is to generate table body.
     */
    generateTableBody() {
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

        if (this.tableInformation.dataset !== null) {
            this.tableInformation.dataset.forEach(rowJson => {
                let country = rowJson.country;
                let year = rowJson.year;
                document.getElementById(country + ':' + year).textContent = rowJson.BMI_value;
                document.getElementById('country=' + country).textContent = country;
            });
        }
    }

    /**
     * This function's purpose is to create the table based on data base (now euroStat).
     */
    generateTable() {
        this.generateTableHead();
        this.sortDataset("country");
        this.generateTableBody();
    }

    /**
     * This function's purpose is to interchange two countries in dataset
     */
    swap(year, i, j) {
        let years = window.sessionStorage.getItem("years");
        years = years.split(',');
        let count;
        for (let a = 0; a < years.length; a++) {
            if (years[a] === year) {
                count = a;
                break;
            }
        }
        for (let k = 0; k < years.length; k++) {
            let aux = this.tableInformation.dataset[i + k - count];
            this.tableInformation.dataset[i + k - count] = this.tableInformation.dataset[j + k - count];
            this.tableInformation.dataset[j + k - count] = aux;
        }
    }

    /**
     * This function's purpose is to sort ascending (by default) dataset by BMI value for selected year
     * @param year
     * @param asc
     */
    sortByYear(year, asc) {
        if (this.tableInformation.dataset.length > 1) {
            for (let i = 0; i < this.tableInformation.dataset.length - 1; i++) {
                for (let j = i + 1; j < this.tableInformation.dataset.length; j++) {
                    if (this.tableInformation.dataset[i]["year"] === this.tableInformation.dataset[j]["year"]
                        && this.tableInformation.dataset[j]["year"] === year) {
                        if (asc === "true" && this.tableInformation.dataset[i]["BMI_value"] > this.tableInformation.dataset[j]["BMI_value"]) {
                            this.swap(year, i, j);
                            return;
                        }
                        if (asc === "false" && this.tableInformation.dataset[i]["BMI_value"] < this.tableInformation.dataset[j]["BMI_value"]) {
                            this.swap(year, i, j);
                            return;
                        }
                    }
                }
            }
        }
    }
}

let chart;
window.addEventListener("load", () => {
    refreshFilters().then(() => {
            tableChart = chart = new TableChart();
        }
    )
    ;
})
