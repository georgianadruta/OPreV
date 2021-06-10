class LineChart extends OPreVChart {
    chart;
    data = {
        labels: Array(),
        datasets: [{
            label: '',
            data: this.tableInformation.dataset,
            fill: false,
            backgroundColor: 'rgb(39, 174, 96)',
            borderColor: 'rgb(39, 174, 96)',
            tension: 0.1
        }]
    };
    config = {
        type: 'line',
        data: this.data,
        options: this.options,
    };

    constructor() {
        super();
        getAllPossibleValuesOfFilterHTTPRequest("years").then(result => {
            this.data.labels = result;
            this.chart = new Chart(document.getElementById("lineChart").getContext("2d"), this.config);
        });
    }

    /**
     * Getter
     * @returns {*}
     */
    getChart() {
        return this.chart;
    }

    /**
     * This function's purpose is to render the new dataset.
     */
    generateLineChart() {
        lineChart = this.chart = new Chart(document.getElementById('lineChart'), this.config);
    }

    /**
     * This function's purpose is to add a new label to dataset.
     * @param label
     * @param data
     */
    addData(label, data) {
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        this.chart.update();
    }

    /**
     * This function's purpose is to remove data from chart.
     */
    removeData() {
        this.chart.data.labels.pop();
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
        this.chart.update();
    }
}

let chart;
window.addEventListener("load", () => {
    refreshFilters().then(() => lineChart = chart = new LineChart())
})

