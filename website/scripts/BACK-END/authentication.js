function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * This function's purpose is to change the text based on what happens with the form.
 * @param text the new text
 * @param color a color to change the text if specified. Or null otherwise
 */
let changeSpanText = function (text, color = null) {
    document.getElementById("spanTextBox").innerHTML = text;
    if (color !== null)
        document.getElementById("spanTextBox").style.color = color;
}

/**
 * This method checks if the parameters check regex patterns.
 * @param username the username to check
 * @param password the password to check
 * @param email the email to check ( may be absent)
 * @returns {boolean}
 */
let checkMatches = function (username, password, email = null) {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (usernameRegex.test(username) === false) {
        changeSpanText("Invalid username.", "red");
        return false;
    }

    if (email != null) {
        let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (emailRegex.test(email) === false) {
            changeSpanText("Invalid email.", "red")
            return false;
        }
    }

    let passwordRegex = /^[A-Za-z]\w{7,14}$/;
    if (passwordRegex.test(password) === false) {
        changeSpanText("Invalid password.", "red")
        return false;
    } else
        return true;
}

/**
 * Method to send a POST request with the username and password in order to login.
 * @param username the username to login with
 * @param password the password to login with
 */
let postHTTPRequest = function (username, password) {
    const HTTP = new XMLHttpRequest();
    const url = "/users";
    HTTP.onreadystatechange = function () {
        if (HTTP.readyState === 4) {
            if (HTTP.status === 200)
                changeSpanText(this.responseText, "red");
            else
                changeSpanText(this.responseText, "green");
        }
    }

    HTTP.open("POST", url, true);
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.send(JSON.stringify({"username": username, "password": password,}));
}

/**
 * Method to send a PUT request with the username,email and password in order to register.
 * @param username the username to register with
 * @param email the email to register with
 * @param password the password to register with
 */
let putHTTPRequest = function (username, email, password) {
    const HTTP = new XMLHttpRequest();
    const url = "/users";
    HTTP.onreadystatechange = function () {
        if (HTTP.readyState === 4) {
            if (HTTP.status === 200)
                changeSpanText(this.responseText, "red");
            else
                changeSpanText(this.responseText, "green");
        }
    }
    HTTP.open("PUT", url);
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.send(JSON.stringify({"username": username, "email": email, "password": password,}));
}

/**
 * TODO change alert to some display in html
 */
function register() {
    const username = (document.querySelector("#username").value);
    const password = (document.querySelector("#password").value);
    const email = (document.querySelector("#email").value);

    if (checkMatches(username, password, email) !== false) {
        putHTTPRequest(username, email, password);
    }
}

/**
 * TODO change alert to some display in html
 */
function login() {
    const username = (document.querySelector("#username").value);
    const password = (document.querySelector("#password").value);

    if (checkMatches(username, password) !== false) {
        postHTTPRequest(username, password);
    }
}

