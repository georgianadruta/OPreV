let asc = true;
let fieldName = "country";

/**
 * Setter for asc.
 * @param ascending
 */
function setAsc(ascending) {
    asc = ascending;
}

/**
 * Setter for field name.
 * @param field_name
 */
function setFieldName(field_name) {
    fieldName = field_name;
}

/**
 * This function's purpose is to sort dataset by field name.
 */
function callSort() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "chart_line.html") {
        lineChart.sortDataset(fieldName, asc);
    } else if (page === "chart_bar.html") {
        barChart.sortDataset(fieldName, asc);
        //TODO refresh bar chart
    } else {
        if (fieldName === "country") {
            tableChart.sortDataset(fieldName, asc);
        } else {
            tableChart.sortByYear(fieldName, asc);
        }
        tableChart.generateTableBody();
    }
}

/**
 * This method's purpose is to sort the data based on lexicographical order of labels.
 */
function createSortButtons() {
    let sortSelect = document.getElementById("sortBy");
    sortSelect.innerHTML = '';
    let data = window.sessionStorage.getItem("years");
    let sessionStorageArray;
    if (data.indexOf(',') !== -1) {
        sessionStorageArray = data.split(',');
    } else {
        sessionStorageArray = Array(data);
    }
    sessionStorageArray.sort();
    if (sessionStorageArray[0].length > 0) {
        let option = document.createElement("option");
        option.textContent = "Country";
        option.value = "country";
        sortSelect.append(option);
        sessionStorageArray.forEach(year => {
            let option = document.createElement("option");
            option.textContent = year;
            option.value = year;
            sortSelect.append(option);
        })
    }
}

