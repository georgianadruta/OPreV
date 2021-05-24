const SERVER_HOST = '127.0.0.1';
const PORT = 8081;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let postHTTPRequest = function (username, email, password) {
    const HTTP = new XMLHttpRequest();
    const url = SERVER_HOST + ':' + PORT;
    HTTP.open("POST", url);
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.send(JSON.stringify({"username": username, "email": email, "password": password,}));

    HTTP.onreadystatechange = () => {
        console.log(HTTP.responseText)
    }
}

let checkMatches = function (username, email, password) {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (usernameRegex.test(username) === false) {
        alert("Invalid username.")
        return false;
    }

    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (emailRegex.test(email) === false) {
        alert("Invalid email.")
        return false;
    }
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (passwordRegex.test(password) === false) {
        alert("Invalid password.")
        return false;
    } else
        return true;
}

/**
 * TODO change alert to some display in html
 * TODO send http post request to the server
 */
async function register() {
    const username = (document.querySelector("#username").value);
    const password = (document.querySelector("#password").value);
    const email = (document.querySelector("#email").value);

    if (checkMatches(username, email, password) === false) {
    }

    postHTTPRequest(username, email, password);

    await sleep(100000);
}


