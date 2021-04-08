window.onload = function () {

    const data = {
        labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"],
        datasets: [{
            label: 'Overweight by BMI',
            data: [NaN, NaN, NaN, NaN, 51.1, 51.8, 51.8, 51.8],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const config = {
        type: 'line',
        data: data,
        options: options,
    };

    var ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, config);
}