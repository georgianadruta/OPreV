let chart;
const data = {
    labels: getDatasetLabels(),
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
const config = {
    type: 'bar',
    data,
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

function getBarChart() {
    return chart;
}

window.addEventListener("load", function () {
    chart = new Chart(document.getElementById('barChart').getContext('2d'), config);
});


