function exportPNG() {
    const a = document.createElement("a");

    let chart = getChart();
    if (chart === barChart) {
        a.href = document.getElementById("barChart").toDataURL();
        a.download = "barChart.png";
        a.click();

    }
    if (chart === tableChart) {
        const table = document.getElementById("table-container");
        html2canvas(table).then(function (canvas) {
            a.href = canvas.toDataURL("image/png");
            a.download = 'table.png';
            a.click();
        });
    }
    if (chart === lineChart) {
        a.href = document.getElementById("lineChart").toDataURL();
        a.download = "lineChart.png";
        a.click();

    }
}

function exportSVG() {
    const a = document.createElement("a");
    a.href = myChart.toBase64Image("image/svg+xml", 1);
    a.download = "barChart.svg";

    // Trigger the download
    a.click();
}

function exportCSV() {
    let chart = getChart();
    let chartName;
    if (chart === barChart) {
        chartName = "barChart";
    }
    if (chart === tableChart) {
        chartName = "tableChart";
    }
    if (chart === lineChart) {
        chartName = "lineChart";
    }

    let labels = ["ID", "country", "year", "BMI_value"];
    let dataset = chart.tableInformation.dataset;

    const csvString = [
        labels,
        ...dataset.map(item => [
            item.ID,
            item.country,
            item.year,
            item.BMI_value,
        ])].map(e => e.join(",")).join("\n");
    let csvContent =
        "data:text/csv;charset=utf-8," + csvString;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", chartName + ".csv");
    document.body.appendChild(link);

    link.click();
}
