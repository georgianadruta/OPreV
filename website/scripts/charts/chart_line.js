const data_labels = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2020", "2021"];
const Overweight_dataset2008 = [NaN, NaN, NaN, NaN, 51.1, 51.8, 51.8, 51.8];
const Overweight_dataset2014 = [NaN, NaN, NaN, NaN, 55.1, 41.8, 51.8, 91.8];
const Overweight_dataset2017 = [NaN, NaN, NaN, NaN, 55.1, 51.8, 61.8, 21.8];

const PreObese_dataset2008 = [NaN, NaN, NaN, NaN, 41.1, 55.8, 50.8, 59.8];
const PreObese_dataset2014 = [NaN, NaN, NaN, NaN, 52.1, 43.8, 41.8, 51.8];
const PreObese_dataset2017 = [NaN, NaN, NaN, NaN, 20.1, 21.8, 31.8, 27.8];

const Obese_dataset2008 = [NaN, NaN, NaN, NaN, 21.1, 21.8, 31.8, 41.8];
const Obese_dataset2014 = [NaN, NaN, NaN, NaN, 25.1, 21.8, 31.8, 41.8];
const Obese_dataset2017 = [NaN, NaN, NaN, NaN, 25.1, 21.8, 31.8, 41.8];

var data = {
    labels: data_labels,
    datasets: [{
        label: 'Overweight by BMI',
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0,
        data: Overweight_dataset2008
    },
    {
        label: 'PreObese BMI',
        fill: false,
        borderColor: 'red',
        tension: 0,
        data: PreObese_dataset2008
    },
    {
        label: 'Obese by BMI',
        fill: false,
        borderColor: 'black',
        tension: 0,
        data: Obese_dataset2008
    },
    ]
};

var options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

var config = {
    type: 'line',
    data: data,
    options: options,
};

var lineChart;
window.onload = function () {
    lineChart = new Chart(document.getElementById('lineChart').getContext('2d'), config);
};

function changeChartDataByYear(year) {
    switch (year) {
        case '2008': {
            lineChart.data.datasets[0].data = Overweight_dataset2008;
            lineChart.data.datasets[1].data = PreObese_dataset2008;
            lineChart.data.datasets[2].data = Obese_dataset2008;
            break;
        }
        case '2014': {
            lineChart.data.datasets[0].data = Overweight_dataset2014;
            lineChart.data.datasets[1].data = PreObese_dataset2014;
            lineChart.data.datasets[2].data = Obese_dataset2014;
            break;
        }
        case '2017': {
            lineChart.data.datasets[0].data = Overweight_dataset2017;
            lineChart.data.datasets[1].data = PreObese_dataset2017;
            lineChart.data.datasets[2].data = Obese_dataset2017;
            break;
        }
    }
    lineChart.update();
}
