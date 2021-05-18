function chooseDatasetFunction() {
    document.getElementById("dropdownFormats-dataset").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.set_dataset_button')) {
        const dropdowns = document.getElementsByClassName("dropdown-content-datasets");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}