const SERVER_HOST = '127.0.0.1';
const PORT = 8081;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * This function's purpose is to change the text based on what happens with the form.
 * @param text the new text
 */
let changeSpanText = function (text) {
    document.getElementById("spanTextBox").innerHTML = text;
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
        changeSpanText("Invalid username.")
        return false;
    }

    if (email != null) {
        let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (emailRegex.test(email) === false) {
            changeSpanText("Invalid email.")
            return false;
        }
    }

    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (passwordRegex.test(password) === false) {
        changeSpanText("Invalid password.")
        return false;
    } else
        return true;
}

let postHTTPRequest = function (username, password) {
    const HTTP = new XMLHttpRequest();
    const url = SERVER_HOST + ':' + PORT + "/users";
    HTTP.open("POST", url);
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.send(JSON.stringify({"username": username, "password": password,}));

    HTTP.onreadystatechange = () => {
        console.log(HTTP.responseText)
    }
}

let putHTTPRequest = function (username, email, password) {
    const HTTP = new XMLHttpRequest();
    const url = SERVER_HOST + ':' + PORT + "/users";
    HTTP.open("PUT", url);
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.send(JSON.stringify({"username": username, "email": email, "password": password,}));

    HTTP.onreadystatechange = () => {
        console.log(HTTP.responseText)
    }
}

/**
 * TODO change alert to some display in html
 */
async function register() {
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
async function login() {
    const username = (document.querySelector("#username").value);
    const password = (document.querySelector("#password").value);

    if (checkMatches(username, password) !== false) {
        postHTTPRequest(username, password);
    }
}

