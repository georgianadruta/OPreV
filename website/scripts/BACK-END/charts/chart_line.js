class LineChart extends OPreVChart {
    chart = null;
    data = {
        labels: Array(),
        datasets: []
    };
    config = {
        type: "line",
        data: this.data,
        options: this.options,
    };

    constructor() {
        super();
        getAllPossibleValuesOfFilterHTTPRequest("years").then(result => {
            this.data.labels = result;
            this.generateLineChart();
        });
    }

    /**
     * Getter
     * @returns {*}
     */
    getChart() {
        return this.chart;
    }

    generateLabels() {
        this.data.labels = window.sessionStorage.getItem("years").split(',').sort();
    }

    addToDataset(row) {
        let ok = false;
        this.data.datasets.forEach(json => {
            if (ok === true) {
                return;
            }
            if (json.label === row.country) {
                json.data.push(row.BMI_value);
                ok = true;
            }
        });
        if (ok === false) {
            function random_rgba() {
                let o = Math.round, r = Math.random, s = 255;
                return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
            }

            let json = {
                label: row.country,
                data: [row.BMI_value],
                fill: false,
                backgroundColor: random_rgba(),
                borderColor: random_rgba(),
                tension: 0.1
            };
            this.data.datasets.push(json);
        }
    }

    /**
     * This function's purpose is to sort dataset by country name and year
     */
    sortDatasetByYear() {
        this.tableInformation.dataset.sort((a, b) => {
                if (a["country"].localeCompare(b["country"]) === 0) {
                    return a["year"].localeCompare(b["year"]);
                } else {
                    return a["country"].localeCompare(b["country"]);
                }
            }
        );
    }

    async generateData() {
        try {
            await getDatasetHTTPRequest().then(result => {
                if (result !== null) {
                    this.tableInformation = result;
                    this.sortDatasetByYear();
                    this.data.datasets = [];
                    this.tableInformation.dataset.forEach(row => {
                        this.addToDataset(row);
                    });
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * This function's purpose is to render the new dataset.
     */
    generateLineChart() {
        this.generateLabels();
        this.generateData().then(() => {
            if (this.chart !== null) {
                this.chart.destroy();
            }
            this.chart = new Chart(document.getElementById("lineChart"), this.config);
        });
    }
}

let chart;
window.addEventListener("load", () => {
    refreshFilters().then(() => lineChart = chart = new LineChart())
})

