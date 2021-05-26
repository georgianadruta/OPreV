const countries = ["Albania",
    "Andorra",
    "Armenia",
    "Austria",
    "Azerbaijan",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Kazakhstan",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Malta",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Turkey",
    "Ukraine",
    "United Kingdom",
    "Vatican City",];

function addCountriesInSelect() {
    let selectContainer = document.getElementById("country");
    countries.forEach(item => {
        const option = document.createElement("option");
        option.text = item;
        selectContainer.add(option);
    });
}

/**
 * This method is responsible for calling a HTTP PUT request and hiding the form afterwards.
 */
function addData() {
    //TODO send data
    hideAddForm();
}

/**
 * This method is responsible for showing the table with preview content upon clicking one of the options.
 */
function changePreviewDataset() {
    //hide header
    document.getElementById("chooseDataSetHeading").style.display = "none";
    document.getElementById("datasetPreview").style.display = "flex";
    document.getElementById("dataManipulationButtons").style.display = "flex";
}

/**
 * This method is responsible for showing the form after pressing the Add button
 */
function showAddForm() {
    document.getElementById("dataManipulationForm").style.display = "block";
    document.getElementById("addValues").style.display = "block";
}

/**
 * This method is responsible for hiding the form after finishing the http PUT request.
 */
function hideAddForm() {
    document.getElementById("dataManipulationForm").style.display = "none";
    document.getElementById("addValues").style.display = "none";
    alert("Sent data to the server!")
}

async function createDataTable(contentOrigin) {
    changePreviewDataset();

    let tableInformation;
    let failMessage = null;
    let extraButton = null;
    switch (contentOrigin) {
        case "messages": {
            await getContactMessagesDatasetHTTPRequest().then(data => {
                tableInformation = data;
            }).catch(fail => {
                failMessage = fail;
            });
            break;
        }
        case "who": {
            tableInformation = getWhoDatasetHTTPRequest();
            extraButton = 'Modify';
            break;
        }
        default: {
            tableInformation = getEurostatDatasetHTTPRequest();
            break;
        }
    }
    document.getElementById("datasetPreview").innerHTML = '';

    if (failMessage !== null) {
        alert(failMessage);
        return;
    }

    let tableColumns = tableInformation.tableColumns;
    let tableDataset = tableInformation.dataset;

    let table = document.createElement("table");
    table.classList.add("fl-table");

    let thead = document.createElement("thead");
    let trow = document.createElement("tr");
    thead.append(trow);
    tableColumns.forEach(columnName => {
        const th = document.createElement('th');
        th.innerHTML = columnName;
        thead.append(th);
    })
    const th = document.createElement('th');
    th.innerHTML = 'Action';
    thead.append(th);
    table.append(thead);

    let tbody = document.createElement("tbody");
    tableDataset.forEach(item => {
        trow = document.createElement("tr");
        tbody.append(trow);
        Object.keys(item).forEach(function (key) {
            const td = document.createElement("td");
            td.innerHTML = item[key];
            trow.append(td);
        })
        const td = document.createElement("td");
        td.classList.add("manipulationButtons");
        const button1 = document.createElement("button");
        button1.classList.add("button");
        button1.innerHTML = "Delete";
        td.append(button1);
        if (extraButton != null) {
            const button2 = document.createElement("button");
            button2.classList.add("button");
            button2.innerHTML = extraButton;
            td.append(button2);
        }
        trow.append(td);
    })
    table.append(tbody);

    let tableContainer = document.getElementById("datasetPreview");
    tableContainer.append(table);
}

window.addEventListener("load", function () {
    addCountriesInSelect();
    document.getElementById("sendButton").value = "Send data";
    document.getElementById("sendButton").style.color = "black";
})
