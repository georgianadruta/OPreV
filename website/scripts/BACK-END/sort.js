/**
 * This method's purpose is to sort the data based on user-selected options
 */

//TODO Georgiana js for sort and by buttons in table chart

window.addEventListener("load", function () {

    let tempLabels = Array();
    let tempData = Array();
    let tempDataset = Array();

    // find the user-selected options
    const sortByDropdown = document.querySelector(".sort-by");
    const sortOrderDropdown = document.querySelector(".sort-order");

    // order ascending if sortOrderDropdown==="asc"
    const ascendingSort = (sortByValue) => {
        return tempDataset.sort((a, b) => {
            if (a[sortByValue] < b[sortByValue]) return -1;
            if (a[sortByValue] > b[sortByValue]) return 1;
            return 0;
        });
    };

    // order descending if sortOrderDropdown==="desc"
    const descendingSort = (sortByValue) => {
        return tempDataset.sort((a, b) => {
            if (a[sortByValue] < b[sortByValue]) return 1;
            if (a[sortByValue] > b[sortByValue]) return -1;
            return 0;
        });
    };

    sortByDropdown.addEventListener("change", () => {
        // create a json array
        tempLabels = getDatasetLabels();
        tempData = getDatasetData();
        tempDataset = Array();
        for (let i = 0; i < tempLabels.length; i++) {
            tempDataset.push(
                {
                    "country": tempLabels[i],
                    "first": tempData[0][i],
                    "second": tempData[1][i],
                    "third": tempData[2][i]
                });
        }

        const sortByValue = sortByDropdown.value; // country or year value
        const sortOrderValue = sortOrderDropdown.value; // asc or desc value

        const sorted =
            sortOrderValue === "desc"
                ? descendingSort(sortByValue)
                : ascendingSort(sortByValue);

        // rearrange the data: arrays for labels and data values
        let arrayLabels = Array();
        let firstData = Array();
        let secondData = Array();
        let thirdData = Array();
        for (let i = 0; i < sorted.length; i++) {
            arrayLabels.push(sorted[i].country);
            firstData.push(sorted[i].first);
            secondData.push(sorted[i].second);
            thirdData.push(sorted[i].third);
        }
        setDatasetLabels(arrayLabels);
        let finalData = Array();
        finalData.push(firstData);
        finalData.push(secondData);
        finalData.push(thirdData);
        setDatasetData(finalData);

        // refresh the chart
        let path = window.location.pathname;
        let str = path.split("/");
        if (str[str.length - 1] === "chart_table.html") {
            tableChart.refreshTableData();
            tableChart.generateTable();
        } else {
            if (str[str.length - 1] === "chart_bar.html") {
                barChart.refreshChartData();
                barChart.getBarChart();
            } else {
                if (str[str.length - 1] === "chart_line.html") {
                    //TODO
                }
            }
        }
    });

    sortOrderDropdown.addEventListener("change", () => {
        const event = new Event("change");
        const sortByValue = sortByDropdown.value;
        if (sortByValue) {
            sortByDropdown.dispatchEvent(event);
        }
    });
});