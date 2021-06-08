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
        //TODO repara ce ai facut aici ca nu stim ce ai vrut sa faci. (ps: add javadoc)

        // applyAllFilters().then(result => {
        //     this.data.labels = result.labels;
        //     this.chart = new Chart(document.getElementById('barChart').getContext('2d'), this.config);
        //
        //     for (let i = 0; i < Object.keys(result.years).length; i++) {
        //         this.data.datasets[i]['data'] = result.years[Object.keys(result.years)[i]].map(x => x.BMI_value);
        //     }
        //     this.chart.update();
        // }).catch(err => {
        //     console.log(err)
        // })
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
    refreshFilters();
})







