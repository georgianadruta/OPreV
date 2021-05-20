let config;
let setConfig = function (configOption) {
    const dataset = generateDatasetLineChart(configOption);
    const data = {
        labels: dataset[0],
        datasets: Array(),
    };

    for (let i = 1; i < dataset.length; i++) {
        data.datasets.push(dataset[i]);
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    config = {
        type: 'line',
        data: data,
        options: options,
    };
}

let lineChart;
window.addEventListener("load", function (event) {
    setConfig(1);
    lineChart = new Chart(document.getElementById('lineChart').getContext('2d'), config);
    // createCheckboxes();
});

function changeChartData(data_origin) {
    switch (data_origin) {
        case 'European Union - 27 countries (from 2020)': {
            setConfig(1);
            break;
        }
        case 'Euro area - 19 countries  (from 2015)': {
            setConfig(2);
            break;
        }
    }
    lineChart.update();
}

function createCheckboxes() {
    const container = document.getElementById('countries');
    for (let i = 0; i < dataSet.length; i++) {
        const parent = document.createElement('div');
        parent.className = 'country';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'country' + i;
        checkbox.name = dataSet[i][0];
        checkbox.value = dataSet[i][0];
        checkbox.checked = true;

        const label = document.createElement('label');
        label.htmlFor = 'country' + i;
        label.appendChild(document.createTextNode(dataSet[i][0]));

        parent.appendChild(checkbox);
        parent.appendChild(label);

        container.appendChild(parent);
    }
}

