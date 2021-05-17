function chooseDatasetFunction() {
    document.getElementById("dropdownFormats-dataset").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.set_dataset_button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content-datasets");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}