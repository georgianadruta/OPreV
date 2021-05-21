/**
 * This method's purpose is to sort the data based on lexicographical order of labels.
 */
function sortDataByLabel() {
    let newLabels = getDatasetLabels();
    let newData = getDatasetData();
    for (let i = 0; i < newLabels.length; i++) {
        for (let j = 0; j < newLabels.length; j++) {
            if (newLabels[j].toLowerCase().localeCompare(newLabels[i].toLowerCase()) > 0) {
                [newLabels[i], newLabels[j]] = [newLabels[j], newLabels[i]];
                [newData[i], newData[j]] = [newData[j], newData[i]];
            }
        }
    }
    setDatasetLabels(newLabels);
    setDatasetData(newData);
}