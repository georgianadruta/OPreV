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
const sortByDropdown = document.querySelector(".sort-by");
const sortOrderDropdown = document.querySelector(".sort-order");
const container = document.querySelector(".products");

const displayProducts = (products) => {
    let result = "";

    data.forEach(({country, first, second, third}) => {
        result += `
   <div class="product">
    <div><strong>Country:</strong><span>${country}</span></div>
    <div><strong>First year:</strong><span>${first}</div>
    <div><strong>Second year:</strong><span>${second}</div>
    <div><strong>Third year:</strong><span>${third}</div>
   </div>
  `;
    });

    container.innerHTML = result;
};

const ascendingSort = (sortByValue) => {
    return data.sort((a, b) => {
        if (a[sortByValue] < b[sortByValue]) return -1;
        if (a[sortByValue] > b[sortByValue]) return 1;
        return 0;
    });
};

const descendingSort = (sortByValue) => {
    return data.sort((a, b) => {
        if (a[sortByValue] < b[sortByValue]) return 1;
        if (a[sortByValue] > b[sortByValue]) return -1;
        return 0;
    });
};

sortByDropdown.addEventListener("change", () => {
    const sortByValue = sortByDropdown.value; // price or ram value
    const sortOrderValue = sortOrderDropdown.value; // asc or desc value

    const sorted =
        sortOrderValue === "desc"
            ? descendingSort(sortByValue)
            : ascendingSort(sortByValue);

    displayProducts(sorted);
});

sortOrderDropdown.addEventListener("change", () => {
    const event = new Event("change");
    const sortByValue = sortByDropdown.value;

    if (sortByValue) {
        sortByDropdown.dispatchEvent(event);
    }
});

displayProducts(products);
