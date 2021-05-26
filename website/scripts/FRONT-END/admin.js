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

/**
 * Method that calls HTTP DELETE request with the given id
 * @param id the id to be deleted
 * @param contentOrigin the table to refresh
 */
async function deleteFunction(id, contentOrigin) {
    let jsonObject = {
        "id": id,
    };
    try {
        alert(await deleteDataFromAdminPageHTTPRequest(jsonObject));
    } catch (err) {
        alert(err);
    }
    await createDataTable(contentOrigin);
}

/**
 * Method that calls HTTP POST request to modify some data at the given id
 * @param id the id to be modified
 * @param contentOrigin the table to refresh
 */
async function modifyFunction(id, contentOrigin) {
    let jsonObject = {
        "id": id,
    };
    try {
        alert(await modifyDataFromAdminPageHTTPRequest(jsonObject));
    } catch (err) {
        alert(err);
    }
    await createDataTable(contentOrigin);
}

/**
 * This method is responsible for calling methods to get data and render all data tables.
 * @param contentOrigin the name of the data to show
 * @return {Promise<void>} unused
 */
async function createDataTable(contentOrigin) {
    changePreviewDataset();

    let tableInformation;
    let failMessage = null;
    let deleteButton = null;
    let modifyButton = null;
    switch (contentOrigin) {
        case "messages": {
            await getContactMessagesDatasetHTTPRequest().then(data => {
                tableInformation = data;
                if (tableInformation.dataset.length > 1) deleteButton = 'Delete';
                window.sessionStorage.setItem("deleteTable", "contact_messages");
            }).catch(fail => {
                failMessage = fail;
            });
            document.getElementById("addButton").style.display = "none";
            break;
        }
        case "who": {
            document.getElementById("addButton").style.display = "flex";
            tableInformation = getWhoDatasetHTTPRequest();
            modifyButton = 'Modify';
            window.sessionStorage.setItem("deleteTable", "who_dataset");
            window.sessionStorage.setItem("modifyValue", "who_dataset");
            break;
        }
        default: {
            document.getElementById("addButton").style.display = "flex";
            tableInformation = getEurostatDatasetHTTPRequest();
            window.sessionStorage.setItem("deleteTable", "eurostat_dataset");
            window.sessionStorage.setItem("modifyValue", "who_dataset");
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
        let id;
        Object.keys(item).forEach(function (key) {
            const td = document.createElement("td");
            td.innerHTML = item[key];
            if (key.toString().toLowerCase() === "id") id = item[key];
            trow.append(td);
        })
        const td = document.createElement("td");
        td.classList.add("manipulationButtons");
        if (deleteButton != null) {
            const button = document.createElement("button");
            button.classList.add("button");
            button.innerHTML = modifyButton;
            button.setAttribute("onclick", "modifyFunction(" + id + ",'" + contentOrigin + "')");
            td.append(button);
        }
        if (modifyButton != null) {
            const button = document.createElement("button");
            button.classList.add("button");
            button.innerHTML = modifyButton;
            button.setAttribute("onclick", "modifyFunction(" + id + ",'" + contentOrigin + "')");
            td.append(button);
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
