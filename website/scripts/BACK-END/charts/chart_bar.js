class BarChart extends OPreVChart {
    chart;
    data = {
        labels: Array(),
        datasets: [
        ]
    };
    config = {
        type: 'bar',
        data: this.data,
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
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

    random_rgba() {
        let o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
    }

    /**
     * This function's purpose is to render the new dataset.
     */
    generateChartBar() {
        if (this.chart === undefined) {
            this.chart = new Chart(document.getElementById('barChart'), this.config);
        } else {
            this.chart.data.labels = [];
            this.chart.data.datasets = [];

            let countries = this.tableInformation.dataset.map(data => data.country).filter(onlyUnique);
            let years = this.tableInformation.dataset.map(data => data.year).filter(onlyUnique);

            let dataset = [];
            let sexFilter = window.sessionStorage.getItem("SexFilter");

            for (let i = 0; i < countries.length; i++) {
                if (dataset.filter(x => x.country !== countries[i])) {

                    let datasetYears = [];
                    for (let j = 0; j < years.length; j++) {
                        datasetYears[years[j]] = this.tableInformation.dataset.find(x =>
                            x.country === countries[i] && x.year === years[j] && x.sex === sexFilter).BMI_value;
                    }

                    dataset.push({
                        country: countries[i],
                        years: datasetYears
                    });
                }
            }

            console.log(dataset);

            this.chart.data.labels = countries;

            for (let j = 0; j < years.length; j++) {

                let data = [];
                for (let i = 0; i < countries.length; i++) {
                    data.push(dataset.find(x => x.country === countries[i]).years[years[j]]);
                }
                this.chart.data.datasets.push({
                    label: years[j],
                    data: data,
                    backgroundColor: this.random_rgba(),
                });
            }
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







