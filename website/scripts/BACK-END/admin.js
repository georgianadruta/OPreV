let tableInformation = {
    tableColumns: Array(),
    dataset: Array(),
    deleteButton: Boolean,
    modifyButton: Boolean
}

/**
 * This method is responsible for dynamically generating the input fields for add form based on the cookie 'dataset'
 */
function generateFormInputFields() {
    /*
     <li class="countryInput">
         <label>Country:</label>
         <label for="country"></label>
         <select id="country" name="country"></select>
      </li>
      <li class="year">
          <label for="year"></label>
          <input type="number" id="year" name="year" required placeholder="Choose the year"/>
      </li>
    */


    let ul = document.getElementById("addListOfInputs");
    if (ul === null) return;

    //add select country
    let columnName = tableInformation.tableColumns[1];
    let li = document.createElement("li");
    li.classList.add("countryInput")

    let label = document.createElement("label");
    label.setAttribute("for", columnName);
    label.textContent = "Country:";

    let select = document.createElement("select");
    select.setAttribute("id", "country");
    select.setAttribute("name", "country")
    li.append(label, select);
    ul.append(li);

    //add other countries
    for (let i = 2; i < tableInformation.tableColumns.length; i++) {
        columnName = tableInformation.tableColumns[i];
        li = document.createElement("li");
        li.classList.add(columnName + "Input")

        label = document.createElement("label");
        label.setAttribute("for", columnName);
        label.textContent = columnName + ':';

        let input = document.createElement("input");
        input.setAttribute("name", columnName);
        input.setAttribute("required", "true");
        input.setAttribute("placeholder", "Choose a " + columnName);

        li.append(label, input);
        ul.append(li);
    }

    let sendButtonLi = document.createElement("li");
    sendButtonLi.classList.add("finishButtons")
    let sendButtonInput = document.createElement("input")
    sendButtonInput.setAttribute("onclick", "addData()");
    sendButtonInput.id = "sendButton"
    sendButtonInput.classList.add("btn-lrg", "submit-btn");
    sendButtonInput.type = "submit";
    sendButtonInput.textContent = "Send data";
    sendButtonInput.style.color = "black";
    sendButtonLi.append(sendButtonInput)
    ul.append(sendButtonLi);

    addCountriesInSelect();
}

/**
 * This method is responsible for adding elements to the select html element dynamically
 */
function addCountriesInSelect() {
    let selectContainer = document.getElementById("country");
    if (selectContainer == null)
        return;
    let countries = getCountriesHTTPRequest();
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
    hideAddForm();
}

/**
 * This functions returns the needed type for the createTable function
 * @param jsonDataset the array with the data
 * @param message default message
 * @return {{tableColumns: string[], dataset}|{tableColumns: *[], dataset: *[]}} the correct json format
 */
function parseDataset(jsonDataset, message = "No data") {
    if (jsonDataset.tableColumns.length > 0) {
        jsonDataset.deleteButton = true;
        jsonDataset.modifyButton = true;
    } else {
        jsonDataset.tableColumns = ["server_messages"];
        jsonDataset.dataset = [{server_messages: message}];
        jsonDataset.deleteButton = false;
        jsonDataset.modifyButton = false;
    }
    return jsonDataset;
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
    hideModifyForm();
    generateFormInputFields();
    document.getElementById("addFormContainer").style.display = "flex";
    document.getElementById("addValues").style.display = "flex";
}

/**
 * This method is responsible for hiding the form after finishing the http PUT request.
 */
function hideAddForm() {
    document.getElementById("addFormContainer").style.display = "none";
    document.getElementById("addValues").style.display = "none";
}

/**
 * This method is responsible for showing the form after pressing the Modify button
 */
function showModifyForm() {
    hideAddForm();
    document.getElementById("modifyFormContainer").style.display = "flex";
    document.getElementById("modifyValues").style.display = "flex";
    let id = window.sessionStorage.getItem("id");
    let children = document.getElementById("trow" + id).children;
    let country = children[1].textContent;
    let year = children[2].textContent;
    let BMI = children[3].textContent;

    document.getElementById("modifyCountry").innerHTML = '';
    document.getElementById("modifyBmi").innerHTML = '';
    document.getElementById("modifyYear").innerHTML = '';

    let countryLabel = document.createElement("span");
    countryLabel.textContent = "Country: ";
    let yearLabel = document.createElement("span");
    yearLabel.textContent = "Year: ";
    let BMILabel = document.createElement("span");
    BMILabel.textContent = "Current BMI: ";

    let countryIndicator = document.createElement("span");
    countryIndicator.style.fontSize = "20px"
    countryIndicator.style.marginLeft = "25px";
    countryIndicator.textContent = country;
    let yearIndicator = document.createElement("span");
    yearIndicator.style.fontSize = "30px"
    yearIndicator.style.marginLeft = "25px";
    yearIndicator.textContent = year;
    let BMIIndicator = document.createElement("span");
    BMIIndicator.style.fontSize = "40px"
    BMIIndicator.style.marginLeft = "25px";
    BMIIndicator.textContent = BMI;

    document.getElementById("modifyCountry").append(countryLabel, countryIndicator);
    document.getElementById("modifyBmi").append(yearLabel, yearIndicator);
    document.getElementById("modifyYear").append(BMILabel, BMIIndicator);
}

/**
 * This method is responsible for hiding the form after finishing the http POST request.
 */
function hideModifyForm() {
    document.getElementById("modifyFormContainer").style.display = "none";
    document.getElementById("modifyValues").style.display = "none";
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
 * This method shows a form where the user can insert the new BMI value for the selected field.
 * @param id the id to be modified
 * @param contentOrigin the table to refresh
 */
async function modifyFunction(id, contentOrigin) {
    window.sessionStorage.setItem("id", id);
    window.sessionStorage.setItem("contentOrigin", contentOrigin);
    showModifyForm();
}

/**
 * Method that calls HTTP POST request to modify some data at the given id
 * @return {Promise<void>} unused
 */
async function modifyData() {
    let id = window.sessionStorage.getItem("id")
    let contentOrigin = window.sessionStorage.getItem("contentOrigin");
    let newBMI = document.querySelector("#newBMI").value;
    let jsonObject = {
        "id": id,
        "newBMI": newBMI,
    };
    try {
        //TODO set BMIIndicator cookie
        //setCookie("BMIIndicator",someValue)
        alert(await modifyDataFromAdminPageHTTPRequest(jsonObject));
    } catch (err) {
        alert(err);
    }
    hideModifyForm();
    await createDataTable(contentOrigin);
}

/**
 * This method is responsible for calling methods to get data and render all data tables.
 * @param contentOrigin the name of the data to show
 * @return {Promise<void>} unused
 */
async function createDataTable(contentOrigin) {
    changePreviewDataset();

    let failMessage = null;
    switch (contentOrigin) {
        case "messages": {
            await getContactMessagesDatasetHTTPRequest().then(data => {
                tableInformation = parseDataset(data, "No new contact messages.");
                tableInformation.modifyButton = false;
                tableInformation.tableColumns[0] === "server_messages" ? tableInformation.deleteButton = false : tableInformation.deleteButton = true;
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
    if (tableInformation.deleteButton !== false || tableInformation.modifyButton !== false) {
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
            if (key.toString().toLowerCase() === "id") {
                id = item[key];
                trow.id = "trow" + id;
            }
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
