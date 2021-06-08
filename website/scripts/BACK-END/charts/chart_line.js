class LineChart extends OPreVChart {
    chart;
    data = {
        labels: Array(),
        datasets: [{
            label: 'All countries',
            data: getDatasetData()[0],
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
        getAllPossibleValuesOfFilterHTTPRequest('countries').then(labels => {
            this.data.labels = labels;
            this.chart = new Chart(document.getElementById('lineChart').getContext('2d'), this.config);
        });

    }

    getChart() {
        return this.chart;
    }

    /**
     * This function's purpose is to render the new dataset.
     */
    generateLineChart() {
        //     lineChart = this.chart = new Chart(document.getElementById('lineChart'), this.config);
        this.chart.update();
    }
}

let chart;
window.addEventListener("load", () => {
    refreshFilters().then(() => lineChart = chart = new BarChart())
})

