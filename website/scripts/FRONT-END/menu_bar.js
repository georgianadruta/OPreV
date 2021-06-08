/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
let prevScrolls = window.pageYOffset;
window.onscroll = function () {
    const currentScrollPos = window.pageYOffset;
    if (prevScrolls > currentScrollPos) {
        document.getElementById("navBar").style.top = "0";
    } else {
        document.getElementById("navBar").style.top = "-50px";
    }
    prevScrolls = currentScrollPos;
}

let changeMenuBarBasedOnLoginLogout = function () {
    let sessionID = getCookie("sessionID");
    document.getElementById("anchorLinksList").style.display = "none";
    if (sessionID === null) {
        document.getElementById("logoutAnchor").style.display = "none";
        document.getElementById("adminPageAnchor").style.display = "none";
        document.getElementById("loginPageAnchor").style.display = "flex";
    } else {
        document.getElementById("logoutAnchor").style.display = "flex";
        document.getElementById("adminPageAnchor").style.display = "flex";
        document.getElementById("loginPageAnchor").style.display = "none";
    }
    document.getElementById("anchorLinksList").style.display = "block";
}


window.addEventListener("load", function () {
    changeMenuBarBasedOnLoginLogout();
});
