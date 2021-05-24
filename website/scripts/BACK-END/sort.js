/**
 * This method's purpose is to sort the data based on lexicographical order of labels.
 */

//TODO Georgiana js for sort and by buttons in table chart

window.addEventListener("load", function () {
    const tempLabels = getLabelsHTTPRequest();
    const tempData = getDatasetDataHTTPRequest();

    let tempDataset = Array();
    for (let i = 0; i < tempLabels.length; i++) {
        tempDataset.push(
            {
                "country": tempLabels[i],
                "first": tempData[0][i],
                "second": tempData[1][i],
                "third": tempData[2][i]
            });
    }

    const sortByDropdown = document.querySelector(".sort-by");
    const sortOrderDropdown = document.querySelector(".sort-order");

    const ascendingSort = (sortByValue) => {
        return tempDataset.sort((a, b) => {
            if (a[sortByValue] < b[sortByValue]) return -1;
            if (a[sortByValue] > b[sortByValue]) return 1;
            return 0;
        });
    };

    const descendingSort = (sortByValue) => {
        return tempDataset.sort((a, b) => {
            if (a[sortByValue] < b[sortByValue]) return 1;
            if (a[sortByValue] > b[sortByValue]) return -1;
            return 0;
        });
    };

    sortByDropdown.addEventListener("change", () => {
        const sortByValue = sortByDropdown.value; // country or year value
        const sortOrderValue = sortOrderDropdown.value; // asc or desc value

        const sorted =
            sortOrderValue === "desc"
                ? descendingSort(sortByValue)
                : ascendingSort(sortByValue);

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
        refreshTableData();
        generateTable();
    });

    sortOrderDropdown.addEventListener("change", () => {
        const event = new Event("change");
        const sortByValue = sortByDropdown.value;
        if (sortByValue) {
            sortByDropdown.dispatchEvent(event);
        }
    });
});