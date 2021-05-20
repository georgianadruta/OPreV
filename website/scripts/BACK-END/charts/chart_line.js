let chart;
let data = {
    labels: getDatasetLabels(),
    datasets: [{
        label: 'All countries',
        data: getDatasetData()[0],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
}
let options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};
let config = {
    type: 'line',
    data: data,
    options: options,
};

function getLineChart() {
    return chart;
}

window.addEventListener("load", function () {
    chart = new Chart(document.getElementById('lineChart').getContext('2d'), config);
});
