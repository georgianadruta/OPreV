const data_labels = ["2010", "2012", "2014", "2016", "2018", "2020", "2021-present"]

const Overweight_dataset1 = [NaN, NaN, NaN, 51.1, NaN, 51.8, NaN];
const PreObese_dataset1 = [NaN, NaN, NaN, 35.7, NaN, 36.9, NaN];
const Obese_dataset1 = [NaN, NaN, NaN, 15.4, NaN, 14.6, NaN];

const Overweight_dataset2 = [NaN, NaN, NaN, 21.1, NaN, 41.8, NaN];
const PreObese_dataset2 = [NaN, NaN, NaN, 31.1, NaN, 68.8, NaN];
const Obese_dataset2 = [NaN, NaN, NaN, 11.1, NaN, 62.8, 65.5];


var data = {
    labels: data_labels,
    datasets: [{
        label: 'Overweight by BMI',
        data: Overweight_dataset1,

        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0,
        spanGaps: true,
        pointHoverBorderColor: "black",
        pointHoverRadius: 7
    },
    {
        label: 'PreObese BMI',
        data: PreObese_dataset1,

        fill: false,
        borderColor: 'red',
        tension: 0,
        spanGaps: true
    },
    {
        label: 'Obese by BMI',
        data: Obese_dataset1,

        fill: false,
        borderColor: 'black',
        tension: 0,
        spanGaps: true
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

function changeChartData(data_origin) {
    switch (data_origin) {
        case 'European Union - 27 countries (from 2020)': {
            lineChart.data.datasets[0].data = Overweight_dataset1;
            lineChart.data.datasets[1].data = PreObese_dataset1;
            lineChart.data.datasets[2].data = Obese_dataset1;
            break;
        }
        case 'Euro area - 19 countries  (from 2015)': {
            lineChart.data.datasets[0].data = Overweight_dataset2;
            lineChart.data.datasets[1].data = PreObese_dataset2;
            lineChart.data.datasets[2].data = Obese_dataset2;
            break;
        }
    }
    lineChart.update();
}
