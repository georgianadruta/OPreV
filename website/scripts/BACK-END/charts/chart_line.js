class LineChart extends OPreVChart {
    chart = null;
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
        this.data.labels = window.sessionStorage.getItem("years").split(',');
    }

    /**
     * This function's purpose is to render the new dataset.
     */
    generateLineChart() {
        this.generateLabels();
        if (this.chart !== null) {
            this.chart.destroy();
        }
        this.chart = new Chart(document.getElementById('lineChart'), this.config);
    }
}

let chart;
window.addEventListener("load", () => {
    refreshFilters().then(() => lineChart = chart = new LineChart())
})

