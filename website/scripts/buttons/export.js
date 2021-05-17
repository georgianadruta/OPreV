function exportPNG() {
  var a = document.createElement("a");
  //a.href = myChart.toBase64Image("image/jpeg", 1);
  a.href = document.getElementById("barChart").toDataURL();
  a.download = "barChart.png";

  // Trigger the download
  a.click();
}
function exportSVG() {
  var a = document.createElement("a");
  a.href = myChart.toBase64Image("image/svg+xml", 1);
  a.download = "barChart.svg";

  // Trigger the download
  a.click();
}
function exportCSV() {
  var dataset;
  var year = document.getElementById("year").value;
  switch (year) {
    case "2008": {
      dataset = dataset2008;
      break;
    }
    case "2014": {
      dataset = dataset2014;
      break;
    }
    case "2017": {
      dataset = dataset2017;
      break;
    }
  }

  const rows = [labels, dataset];

  let csvContent =
    "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "barChart.csv");
  document.body.appendChild(link);

  link.click();
}
