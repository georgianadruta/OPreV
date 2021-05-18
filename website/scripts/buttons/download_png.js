const html2canvas = require("html2canvas");

function download_png_file(elementID) {
    html2canvas(document.querySelector(elementID)).then(canvas => {
        canvas.toBlob(function (blob) {
            saveAs(blob, "OPrev_chart.png");
        });
    });
}
