const labels = [
    'Belgium', 'Bulgaria', 'Czechia', 'Denmark', 'Estonia', 'Ireland', 'Greece', 'Spain', 'France', 'Croatia', 'Italy', 'Germany', 'European Union - 27 countries (from 2020)', 'European Union - 28 countries (2013-2020)', 'European Union - 27 countries (2007-2013)', 'Euro area - 19 countries  (from 2015)', 'Euro area - 18 countries (2014)', 'Cyprus', 'Latvia', 'Lithuania', 'Luxembourg', 'Hungary', 'Malta', 'Netherlands', 'Austria', 'Poland', 'Portugal', 'Romania', 'Slovenia', 'Slovakia', 'Finland', 'Sweden', 'Iceland', 'Norway', 'Switzerland', 'United Kingdom', 'North Macedonia', 'Serbia', 'Turkey'
];

const dataset2008 = [14.0, 11.5, 18.3, 0, 15.8, 0, 0, 0, 0, 0, 18.5, 0, 17.6, 15.7, 12.2, 0, 0, 15.6, 16.9, 0, 0, 20.0, 22.9, 0, 12.8, 16.4, 0, 7.9, 16.8, 15.1, 0, 0, 0, 0, 0, 0, 0, 0, 16.2];
const dataset2014 = [14.0, 14.8, 19.3, 14.9, 16.9, 15.4, 15.9, 0, 0, 0, 20.4, 18.7, 17.3, 16.7, 15.3, 18.7, 10.8, 14.5, 21.3, 17.3, 15.6, 21.2, 26.0, 13.3, 14.7, 17.2, 16.6, 9.4, 19.2, 16.3, 18.3, 14.0, 19.0, 13.1, 0, 20.1, 0, 0, 21.2];
const dataset2017 = [14.7, 14.6, 14.1, 20.5, 0, 14.9, 15.2, 15.2, 14.6, 0, 21.0, 15.2, 0, 14.1, 15.4, 18.2, 0, 14.7, 21.6, 17.4, 16.0, 20.0, 25.7, 12.7, 15.0, 16.9, 15.7, 10.4, 16.2, 14.4, 20.6, 0, 0, 14.2, 0, 21.0, 10.5, 13.3, 0];

const data = {
    labels: labels,
    datasets: [{
        label: 'Year 2008',
        backgroundColor: 'rgb(41, 128, 185)',
        borderColor: 'rgb(41, 128, 185)',
        data: dataset2008,
    }, {
        label: 'Year 2014',
        backgroundColor: 'rgb(39, 174, 96)',
        borderColor: 'rgb(39, 174, 96)',
        data: dataset2014,
    }, {
        label: 'Year 2017',
        backgroundColor: 'rgb(243, 156, 18)',
        borderColor: 'rgb(243, 156, 18)',
        data: dataset2017,
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

var lineChart;
window.onload = function () {
    myChart = new Chart(document.getElementById('barChart').getContext('2d'), config);
    createCheckboxes();
};

function createCheckboxes() {
    const container = document.getElementById('countries');
    for (let i = 0; i < labels.length; i++) {
        const parent = document.createElement('div');
        parent.className = 'country';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'country' + i;
        checkbox.name = labels[i];
        checkbox.value = labels[i];
        checkbox.checked = true;

        const label = document.createElement('label');
        label.htmlFor = 'country' + i;
        label.appendChild(document.createTextNode(labels[i]));

        parent.appendChild(checkbox);
        parent.appendChild(label);

        container.appendChild(parent);
    }
}

function selectAll() {
    for (let i = 0; i < labels.length; i++) {
        const checkbox = document.getElementById('country' + i);
        checkbox.type = 'checkbox';
        checkbox.checked = true;
    }
}

function deselectAll() {
    for (let i = 0; i < labels.length; i++) {
        const checkbox = document.getElementById('country' + i);
        checkbox.type = 'checkbox';
        checkbox.checked = false;
    }
}