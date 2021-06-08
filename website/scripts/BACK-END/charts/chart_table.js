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
     * This function's purpose is to create the table based on data base (now euroStat).
     */
    generateTable() {
        const table = document.getElementById("table");
        table.innerHTML = '';

        if (this.tableInformation.dataset.length > 0) {
            for (let i = 0; i < this.tableInformation.dataset.length - 3; i = i + 3) {
                let tr = table.insertRow(-1);
                tr.id = 'country-' + i;

                const thLabel = document.createElement("td");
                thLabel.innerHTML = this.tableInformation.dataset[i].country;
                tr.appendChild(thLabel);

                const th2008 = document.createElement("td");
                th2008.innerHTML = this.tableInformation.dataset[i].BMI_value + '';
                tr.appendChild(th2008);

                const th2014 = document.createElement("td");
                th2014.innerHTML = this.tableInformation.dataset[i + 1].BMI_value + '';
                tr.appendChild(th2014);

                const th2017 = document.createElement("td");
                th2017.innerHTML = this.tableInformation.dataset[i + 2].BMI_value + '';
                tr.appendChild(th2017);

                table.appendChild(tr);
            }
        }
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
