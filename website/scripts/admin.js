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

let select;

function addOption(item) {
    const option = document.createElement("option");
    option.text = item;
    select.add(option);
}

window.onload = function () {
    select = document.getElementById("country");
    countries.forEach(addOption);
    document.getElementById("sendButton").value = "Send data";
}

function sendData() {

}

function changePreviewDataset() {
    //hide header
    document.getElementById("chooseDataSetHeading").style.display = "none";
    document.getElementById("datasetPreview").style.display = "block";
    document.getElementById("dataManipulationButtons").style.display = "flex";

    
}

function showAdminForm(operation) {
    document.getElementById("dataManipulationForm").style.display = "block";
    document.getElementById("addValues").style.display = "none";
    document.getElementById("modifyValues").style.display = "none";
    document.getElementById("deleteValues").style.display = "none";

    if (operation === 'add')
        document.getElementById("addValues").style.display = "block";
    if (operation === 'modify')
        document.getElementById("modifyValues").style.display = "block";
    if (operation === 'delete')
        document.getElementById("deleteValues").style.display = "block";
}