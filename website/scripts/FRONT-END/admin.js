const countries = ['Belgium', 'Bulgaria', 'Czechia', 'Denmark', 'Estonia', 'Ireland', 'Greece', 'Spain', 'France', 'Croatia', 'Italy', 'Germany', 'European Union - 27 countries (from 2020)', 'European Union - 28 countries (2013-2020)', 'European Union - 27 countries (2007-2013)', 'Euro area - 19 countries  (from 2015)', 'Euro area - 18 countries (2014)', 'Cyprus', 'Latvia', 'Lithuania', 'Luxembourg', 'Hungary', 'Malta', 'Netherlands', 'Austria', 'Poland', 'Portugal', 'Romania', 'Slovenia', 'Slovakia', 'Finland', 'Sweden', 'Iceland', 'Norway', 'Switzerland', 'United Kingdom', 'North Macedonia', 'Serbia', 'Turkey'];

function addCountriesInSelect() {
    let selectContainer = document.getElementById("country");
    countries.forEach(item => {
        const option = document.createElement("option");
        option.text = item;
        selectContainer.add(option);
    });
}

/**
 * This functions returns the needed type for the createTable function
 * @param jsonArray the array with the data
 * @return {{tableColumns: string[], dataset}|{tableColumns: *[], dataset: *[]}} the correct json format
 */
function parseDataset(jsonArray) {
    if (jsonArray.length > 0)
        return {
            tableColumns: Object.keys(jsonArray[0]),
            dataset: jsonArray,
            deleteButton: true,
            modifyButton: true,
        };
    else {
        return {
            tableColumns: [],
            dataset: [],
            deleteButton: false,
            modifyButton: false,
        };
    }
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
    switch (contentOrigin) {
        case "messages": {
            await getContactMessagesDatasetHTTPRequest().then(data => {
                tableInformation = data;

                tableInformation.tableColumns[0] === "server_messages" ? tableInformation.delete = false : tableInformation.delete = false;
                tableInformation.delete = false;
                tableInformation.modify = false;
                window.sessionStorage.setItem("deleteTable", "contact_messages");
            }).catch(fail => {
                failMessage = fail;
            });
            document.getElementById("addButton").style.display = "none";
            break;
        }
        case "who": {
            setCookie("dataset", contentOrigin);
            document.getElementById("addButton").style.display = "flex";
            await getDatasetHTTPRequest().then(data => {
                tableInformation = parseDataset(data);
                window.sessionStorage.setItem("deleteTable", "who_dataset");
                window.sessionStorage.setItem("modifyValue", "who_dataset");

            }).catch(fail => {
                failMessage = fail;
            });
            break;
        }
        default: {
            setCookie("dataset", contentOrigin);
            document.getElementById("addButton").style.display = "flex";
            await getDatasetHTTPRequest().then(data => {
                tableInformation = parseDataset(data);
                window.sessionStorage.setItem("deleteTable", "eurostat_dataset");
                window.sessionStorage.setItem("modifyValue", "eurostat_dataset");
            }).catch(fail => {
                failMessage = fail;
            });
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
    if (tableInformation.delete !== false || tableInformation.modify !== false) {
        const th = document.createElement('th');
        th.innerHTML = 'Action';
        thead.append(th);
    }
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
        if (tableInformation.deleteButton === true) {
            const button = document.createElement("button");
            button.classList.add("button");
            button.innerHTML = 'Delete';
            button.setAttribute("onclick", "deleteFunction(" + id + ",'" + contentOrigin + "')");
            td.append(button);
        }
        if (tableInformation.modifyButton === true) {
            const button = document.createElement("button");
            button.classList.add("button");
            button.innerHTML = 'Modify';
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
