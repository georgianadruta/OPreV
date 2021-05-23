/**
 * This method's purpose is to sort the data based on lexicographical order of labels.
 */
// function sortDataByLabel() {
//     let newLabels = getDatasetLabels();
//     let newData = getDatasetData();
//     for (let i = 0; i < newLabels.length; i++) {
//         for (let j = 0; j < newLabels.length; j++) {
//             if (newLabels[j].toLowerCase().localeCompare(newLabels[i].toLowerCase()) > 0) {
//                 [newLabels[i], newLabels[j]] = [newLabels[j], newLabels[i]];
//                 [newData[i], newData[j]] = [newData[j], newData[i]];
//             }
//         }
//     }
//     setDatasetLabels(newLabels);
//     setDatasetData(newData);
// }

//TODO Georgiana js for sort and by buttons in table chart

// click on the column headers to sort ascending, double click for descending
function sort() {

    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr));
    })));
}