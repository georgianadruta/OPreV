function sortFunction() {
    document.getElementById("dropdownFormats-sort").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.sort_button')) {
        const dropdowns = document.getElementsByClassName("dropdown-content-sort");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}