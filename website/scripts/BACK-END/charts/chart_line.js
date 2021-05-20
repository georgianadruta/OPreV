let dataset;
let data;
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

/**
 * This method's purpose is to change the data based configOption parameter
 * @param configOption Number representing the option
 */
let setConfig = function (configOption) {
    //get data from server
    dataset = generateDatasetLineChart(configOption);
    //initialise labels (dataset[0]) and empty datasets
    data = {
        labels: dataset[0],
        datasets: Array(),
    };

    //add datasets
    for (let i = 1; i < dataset.length; i++) {
        data.datasets.push(dataset[i]);
    }

    //set new configuration
    config.data = data;
}


/**
 * This method's purpose is to call setConfig and update the chart based on the client's preferences specified in data_origin parameter.
 * @param data_origin string based on what button was pressed
 */
function changeLineChartData(data_origin) {
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


let lineChart;
window.addEventListener("load", function (event) {
    setConfig(1);
    lineChart = new Chart(document.getElementById('lineChart').getContext('2d'), config);
    // createCheckboxes();
});
