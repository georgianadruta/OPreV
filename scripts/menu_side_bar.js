function openSideNavBar() {
    document.getElementById("sideNavBar").style.width = "120px";
    window.onresize = closeSideNavBar;
}

function closeSideNavBar() {
    document.getElementById("sideNavBar").style.width = "0";
}