/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
let prevScrollpos = window.pageYOffset;
window.onscroll = function () {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navBar").style.top = "0";
    } else {
        document.getElementById("navBar").style.top = "-50px";
    }
    prevScrollpos = currentScrollPos;
}