class BarChart extends OPreVChart {
    chart;
    data = {
        labels: Array(),
        //TODO Make datasets dynamic
        datasets: [{
            label: 'Year 2008',
            backgroundColor: 'rgb(41, 128, 185)',
            borderColor: 'rgb(41, 128, 185)',
            data: [],
        }, {
            label: 'Year 2014',
            backgroundColor: 'rgb(39, 174, 96)',
            borderColor: 'rgb(39, 174, 96)',
            data: [],
        }, {
            label: 'Year 2017',
            backgroundColor: 'rgb(243, 156, 18)',
            borderColor: 'rgb(243, 156, 18)',
            data: [],
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
        this.generateChartBar();
    }

    /**
     * Getter for the chart object
     * @returns {*} the chart object
     */
    getChart() {
        return this.chart;
    }

    /** Getter for the chart data object
     * @returns {*} the chart data object
     */
    getChartData() {
        return this.data;
    }

    /**
     * This function's purpose is to render the new dataset.
     */
    generateChartBar() {
        if (this.chart === undefined) {
            this.chart = new Chart(document.getElementById('barChart'), this.config);
        } else {
            let labels = this.tableInformation.dataset.map(data => data.country).filter(onlyUnique);

            let data2008 = this.tableInformation.dataset.filter(data => data.year === "2008").map(data => data.BMI_value);
            let data2014 = this.tableInformation.dataset.filter(data => data.year === "2014").map(data => data.BMI_value);
            let data2017 = this.tableInformation.dataset.filter(data => data.year === "2017").map(data => data.BMI_value);

            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = data2008;
            this.chart.data.datasets[1].data = data2014;
            this.chart.data.datasets[2].data = data2017;

            this.chart.update();
        }
    }
}

/**
 * This function filter object to retain only unique values
 * @param value
 * @param index
 * @param self
 * @returns {boolean}
 */
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

let chart;
window.addEventListener("load", () => {
    refreshFilters().then(() => barChart = chart = new BarChart())
})







