class BarChart extends OPreVChart {
    chart;
    data = {
        labels: Array(),
        datasets: []
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

    random_rgb() {
        let o = Math.round, r = Math.random, s = 255;
        return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s)  + ')';
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
            let database = window.sessionStorage.getItem("dataset");
            let sexFilter = window.sessionStorage.getItem("SexFilter");

            for (let i = 0; i < countries.length; i++) {
                if (dataset.filter(x => x.country !== countries[i])) {

                    let datasetYears = [];
                    for (let j = 0; j < years.length; j++) {
                        if (database === "eurostat") {
                            let data = this.tableInformation.dataset.find(x =>
                                x.country === countries[i] && x.year === years[j]);
                            datasetYears[years[j]] = data ? data.BMI_value : 0;
                        } else {
                            let data = this.tableInformation.dataset.find(x =>
                                x.country === countries[i] && x.year === years[j] && x.sex === sexFilter);
                            datasetYears[years[j]] = data ? data.BMI_value : 0;
                        }
                    }

                    dataset.push({
                        country: countries[i],
                        years: datasetYears
                    });
                }
            }
            this.chart.data.labels = countries;
            for (let j = 0; j < years.length; j++) {

                let data = [];
                for (let i = 0; i < countries.length; i++) {
                    data.push(dataset.find(x => x.country === countries[i]).years[years[j]]);
                }
                this.chart.data.datasets.push({
                    label: years[j],
                    data: data,
                    backgroundColor: this.random_rgb(),
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







