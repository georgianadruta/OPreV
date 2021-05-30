let tableInformation = {
    tableColumns: Array(),
    dataset: Array(),
    acceptButton: Boolean,
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
async function addCountriesInSelect() {
    let selectContainer = document.getElementById("country");
    if (selectContainer == null)
        return;
    let countries;
    await getAllPossibleValuesOfFilterHTTPRequest('countries').then(countriesArray => {
        countries = countriesArray
    });
    countries.forEach(item => {
        const option = document.createElement("option");
        option.text = item;
        selectContainer.add(option);
    });
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
 * This method is responsible for showing the form after pressing the Add button
 */
function showAddForm() {
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
 * Method that calls HTTP DELETE request with the given id
 * @param id the id to be deleted
 * @param contentOrigin the table to refresh
 */
async function deleteFunction(id, contentOrigin) {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";

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
 * @return {Promise<void>} unused
 */
async function modifyData(id, contentOrigin) {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";

    let newBMI = document.getElementById('newBMIInput' + id).value;
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
    await createDataTable(contentOrigin);

}

/**
 * Method that calls HTTP POST request to add data at the given table
 * @return {Promise<void>} unused
 */
async function addData(contentOrigin) {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";

    let country = document.getElementById('countryInput').value;
    let year = document.getElementById('yearInput').value;
    let newBMI = document.getElementById('newBMIInput').value;
    if (country === '' || year === '' || newBMI === '') {
        alert("Please fill all inputs!");
        return;
    }
    let jsonObject = {
        country: country,
        year: year,
        newBMI: newBMI,
    };
    try {
        //TODO set BMIIndicator cookie
        //setCookie("BMIIndicator",someValue)
        alert(await addDataFromAdminPageHTTPRequest(jsonObject));
    } catch (err) {
        alert(err);
    }
    await createDataTable(contentOrigin);

}

function acceptUser(contentOrigin) {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";

    let country = document.getElementById('countryInput').value;
    let year = document.getElementById('yearInput').value;
    let newBMI = document.getElementById('newBMIInput').value;
}

/**
 * This method is responsible for calling methods to get data and render all data tables.
 * @param contentOrigin the name of the data to show
 * @return {Promise<void>} unused
 */
async function createDataTable(contentOrigin) {

    let failMessage = null;
    switch (contentOrigin) {
        case "messages": {
            await getContactMessagesDatasetHTTPRequest().then(data => {
                tableInformation = parseDataset(data, "No new contact messages.");
                tableInformation.acceptButton = false;
                tableInformation.modifyButton = false;
                tableInformation.tableColumns[0] === "server_messages" ? tableInformation.deleteButton = false : tableInformation.deleteButton = true;
                window.sessionStorage.setItem("deleteTable", "contact_messages");
            }).catch(fail => {
                failMessage = fail;
            });
            break;
        }
        case "approve": {
            await getRequestUsersDatasetHTTPRequest().then(data => {
                tableInformation = parseDataset(data, "No new user requests.");
                tableInformation.acceptButton = true;
                tableInformation.modifyButton = false;
                tableInformation.tableColumns[0] === "server_messages" ? tableInformation.deleteButton = false : tableInformation.deleteButton = true;
                window.sessionStorage.setItem("deleteTable", "registration_requests");
            }).catch(fail => {
                failMessage = fail;
            });
            break;
        }
        case "who": {
            setCookie("dataset", contentOrigin);
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
            document.getElementById("addButton-" + contentOrigin).style.display = "flex";
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

    document.getElementById("datasetPreview-" + contentOrigin).innerHTML = '';

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
        th.innerHTML = columnName.capitalize();
        thead.append(th);
    })
    if (tableInformation.acceptButton !== false || tableInformation.deleteButton !== false || tableInformation.modifyButton !== false) {
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
        if (!item.server_messages) {
            const td = document.createElement("td");
            td.classList.add("manipulationButtons");
            if (tableInformation.acceptButton === true) {
                const button = document.createElement("button");
                button.classList.add("button");
                button.innerHTML = 'Accept';
                button.setAttribute("onclick", "openModal(" + id + ",'" + contentOrigin + "', 'accept')");
                td.append(button);
            }
            if (tableInformation.deleteButton === true) {
                const button = document.createElement("button");
                button.classList.add("button");
                button.innerHTML = 'Delete';
                button.setAttribute("onclick", "openModal(" + id + ",'" + contentOrigin + "', 'delete')");
                td.append(button);
            }
            if (tableInformation.modifyButton === true) {
                const button = document.createElement("button");
                button.classList.add("button");
                button.innerHTML = 'Modify';
                button.setAttribute("onclick", "openModal(" + id + ",'" + contentOrigin + "', 'modify')");
                td.append(button);
            }
            trow.append(td);
        }
    })
    table.append(tbody);

    let tableContainer = document.getElementById("datasetPreview-" + contentOrigin);
    tableContainer.append(table);
}

function openTab(evt, tab) {
    let i, tabContent, tabLinks;

    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    tabLinks = document.getElementsByClassName("tab-links");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";

    switch (tab) {
        case 'eurostat':
        case 'who':
        case 'messages': {
            createDataTable(tab).then(x => console.log(x));
            break;
        }
        case 'approve': {
            createDataTable(tab).then(x => console.log(x));
            break;
        }
    }
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


/**
 * This prototype create a function in String class for capitalizing an existing string
 * @returns {string}
 */
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function openModal(id, contentOrigin, action) {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    const span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const modalTitle = document.getElementById('modal-header');
    modalTitle.innerHTML = '';
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';
    const modalFooter = document.getElementById('modal-footer');
    modalFooter.innerHTML = '';

    switch (action) {
        case 'add': {
            modalTitle.innerHTML = 'Add';

            const country = document.createElement('div');
            country.className = 'form-group';
            const countryLabel = document.createElement('label');
            countryLabel.innerHTML = 'Country';
            const countryInput = document.createElement('input');
            countryInput.type = 'text';
            countryInput.id = 'countryInput';
            country.appendChild(countryLabel);
            country.appendChild(countryInput);

            const year = document.createElement('div');
            year.className = 'form-group';
            const yearLabel = document.createElement('label');
            yearLabel.innerHTML = 'Year';
            const yearInput = document.createElement('input');
            yearInput.type = 'number';
            yearInput.id = 'yearInput';
            year.appendChild(yearLabel);
            year.appendChild(yearInput);


            const newBMI = document.createElement('div');
            newBMI.className = 'form-group';
            const newBMILabel = document.createElement('label');
            newBMILabel.innerHTML = 'New BMI';
            const newBMIInput = document.createElement('input');
            newBMIInput.type = 'number';
            newBMIInput.id = 'newBMIInput';
            newBMI.appendChild(newBMILabel);
            newBMI.appendChild(newBMIInput);

            modalBody.appendChild(country);
            modalBody.appendChild(year);
            modalBody.appendChild(newBMI);

            const acceptButton = document.createElement('button');
            acceptButton.innerHTML = 'Send';
            acceptButton.className = 'button';
            acceptButton.setAttribute("onclick", "addData('" + contentOrigin + "')");

            const cancelButton = document.createElement('button');
            cancelButton.innerHTML = 'Cancel';
            cancelButton.className = 'button';
            cancelButton.onclick = function () {
                modal.style.display = "none";
            }
            modalFooter.appendChild(acceptButton);
            modalFooter.appendChild(cancelButton);

            break;
        }
        case 'modify': {
            let values = document.getElementById('trow' + id).getElementsByTagName('td');

            modalTitle.innerHTML = 'Modify';

            const country = document.createElement('div');
            country.className = 'form-group';
            const countryLabel = document.createElement('label');
            countryLabel.innerHTML = 'Country';
            const countryValue = document.createElement('p');
            countryValue.innerHTML = values[1].innerHTML;
            country.appendChild(countryLabel);
            country.appendChild(countryValue);

            const year = document.createElement('div');
            year.className = 'form-group';
            const yearLabel = document.createElement('label');
            yearLabel.innerHTML = 'Year';
            const yearValue = document.createElement('p');
            yearValue.innerHTML = values[2].innerHTML;
            year.appendChild(yearLabel);
            year.appendChild(yearValue);

            const currentBMI = document.createElement('div');
            currentBMI.className = 'form-group';
            const currentBMILabel = document.createElement('label');
            currentBMILabel.innerHTML = 'Current BMI';
            const currentBMIValue = document.createElement('p');
            currentBMIValue.innerHTML = values[3].innerHTML;
            currentBMI.appendChild(currentBMILabel);
            currentBMI.appendChild(currentBMIValue);

            const newBMI = document.createElement('div');
            newBMI.className = 'form-group';
            const newBMILabel = document.createElement('label');
            newBMILabel.innerHTML = 'New BMI';
            const newBMIInput = document.createElement('input');
            newBMIInput.type = 'number';
            newBMIInput.id = 'newBMIInput' + id;

            newBMI.appendChild(newBMILabel);
            newBMI.appendChild(newBMIInput);

            modalBody.appendChild(country);
            modalBody.appendChild(year);
            modalBody.appendChild(currentBMI);
            modalBody.appendChild(newBMI);

            const acceptButton = document.createElement('button');
            acceptButton.innerHTML = 'Send';
            acceptButton.className = 'button';
            acceptButton.setAttribute("onclick", "modifyData(" + id + ", '" + contentOrigin + "')");

            const cancelButton = document.createElement('button');
            cancelButton.innerHTML = 'Cancel';
            cancelButton.className = 'button';
            cancelButton.onclick = function () {
                modal.style.display = "none";
            }
            modalFooter.appendChild(acceptButton);
            modalFooter.appendChild(cancelButton);


            break;
        }
        case 'delete': {
            modalTitle.innerHTML = 'Delete';
            modalBody.innerHTML = 'Are you sure you want to delete this data row with id ' + id + '?';

            const acceptButton = document.createElement('button');
            acceptButton.innerHTML = 'Yes';
            acceptButton.className = 'button';
            acceptButton.setAttribute("onclick", "deleteFunction(" + id + ",'" + contentOrigin + "')");

            const cancelButton = document.createElement('button');
            cancelButton.innerHTML = 'Cancel';
            cancelButton.className = 'button';
            cancelButton.onclick = function () {
                modal.style.display = "none";
            }
            modalFooter.appendChild(acceptButton);
            modalFooter.appendChild(cancelButton);

            break;
        }
        case 'accept': {
            let values = document.getElementById('trow' + id).getElementsByTagName('td');


            modalTitle.innerHTML = 'Accept';

            const name = document.createElement('div');
            name.className = 'form-group';
            const nameLabel = document.createElement('label');
            nameLabel.innerHTML = 'Name';
            const nameValue = document.createElement('p');
            nameValue.innerHTML = values[1].innerHTML;
            name.appendChild(nameLabel);
            name.appendChild(nameValue);

            const email = document.createElement('div');
            email.className = 'form-group';
            const emailLabel = document.createElement('label');
            emailLabel.innerHTML = 'Email';
            const emailValue = document.createElement('p');
            emailValue.innerHTML = values[2].innerHTML;
            email.appendChild(emailLabel);
            email.appendChild(emailValue);

            modalBody.innerHTML = 'Are you sure you want to approve this request?';
            modalBody.appendChild(name);
            modalBody.appendChild(email);

            const acceptButton = document.createElement('button');
            acceptButton.innerHTML = 'Accept';
            acceptButton.className = 'button';
            acceptButton.setAttribute("onclick", "acceptUser(" + id + ",'" + contentOrigin + "')");

            const cancelButton = document.createElement('button');
            cancelButton.innerHTML = 'Cancel';
            cancelButton.className = 'button';
            cancelButton.onclick = function () {
                modal.style.display = "none";
            }

            modalFooter.appendChild(acceptButton);
            modalFooter.appendChild(cancelButton);


            break;
        }
    }

}