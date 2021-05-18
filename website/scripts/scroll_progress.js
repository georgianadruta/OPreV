window.onscroll = function () {
    myFunction()
};

function myFunction() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("myScrollBar").style.width = scrolled + "%";
}