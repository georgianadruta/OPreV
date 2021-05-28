class BarChart extends OPreVChart {
    chart;
    data = {
        labels: Array(),
        datasets: [{
            label: 'Year 2008',
            backgroundColor: 'rgb(41, 128, 185)',
            borderColor: 'rgb(41, 128, 185)',
            data: getDatasetData()[0],
        }, {
            label: 'Year 2014',
            backgroundColor: 'rgb(39, 174, 96)',
            borderColor: 'rgb(39, 174, 96)',
            data: getDatasetData()[1],
        }, {
            label: 'Year 2017',
            backgroundColor: 'rgb(243, 156, 18)',
            borderColor: 'rgb(243, 156, 18)',
            data: getDatasetData()[2],
        },
        ]
    };
    config = {
        type: 'bar',
        data: this.data,
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        display: true
                    }
                }
            }
        }
    };

    constructor() {
        super();
        getAllPossibleValuesOfFilterHTTPRequest('countries').then(labels => {
            this.data.labels = labels;
            this.chart = new Chart(document.getElementById('barChart').getContext('2d'), this.config);
        });

    }

    /**
     * Getter for the chart object
     * @returns {*} the chart object
     */
    getChart() {
        return this.chart;
    }

    /**
     * This function's purpose is to refresh the chart data
     */
    refreshChartData() {
        this.data.labels = getDatasetLabels();
        for (let i = 0; i < this.data.datasets.length; i++) {
            this.data.datasets[i]['data'] = getDatasetData()[i];
        }
    }
}

let chart;
window.addEventListener("load", () => {
    barChart = chart = new BarChart();
})






