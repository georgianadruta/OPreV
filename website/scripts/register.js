function myFunction() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    this.classList.toggle('fa-eye-slash');
}

function anotherFunction() {
    var x = document.getElementById("anotherInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    this.classList.toggle('fa-eye-slash');
}