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
        changeSpanText("Invalid username format.", "red");
        return false;
    }

    if (email != null) {
        let emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (emailRegex.test(email) === false) {
            changeSpanText("Invalid email format.", "red")
            return false;
        }
    }

    let passwordRegex = /^[A-Za-z]\w{7,14}$/;
    if (passwordRegex.test(password) === false) {
        changeSpanText("Invalid password format.", "red")
        return false;
    } else
        return true;
}

/**
 * This method is responsible for visual effects once the user has successfully logged in.
 */
let successfulLoginLogoutRegisterEffects = function (message) {
    let modal = document.getElementById("messageModal");
    modal.style.display = "block";
    let div = modal.getElementsByTagName("div")[0];
    let paragraphText = div.getElementsByTagName("p")[0];
    if (paragraphText != null) paragraphText.textContent = message;
    paragraphText.style.display = "flex";
    paragraphText.style.justifyContent = "center";
    paragraphText.style.color = "green";
    paragraphText.style.fontSize = "20px";
    setTimeout(() => {
        window.location = "/";//go to home page
        document.getElementById("messageModal").style.display = "none";
    }, 2000);
}

/**
 * Method to send a POST request with the username and password in order to login.
 * @param username the username to login with
 * @param password the password to login with
 */
let postLoginHTTPRequest = function (username, password) {
    const HTTP = new XMLHttpRequest();
    const url = "/users/login";
    HTTP.onreadystatechange = function () {
        if (HTTP.readyState === HTTP.HEADERS_RECEIVED) {
            let cookies = HTTP.getResponseHeader("Change-Cookie")
            if (cookies !== null) {
                let cookie = cookies.split("=");
                setCookie(cookie[0], cookie[1]);
            }
        }
        if (HTTP.readyState === HTTP.DONE) {
            if (HTTP.status >= 400)
                changeSpanText(this.responseText, "red");
            else {
                changeSpanText(this.responseText, "green");
                successfulLoginLogoutRegisterEffects("Successfully logged in. You will be redirected shortly");
            }
        }

    }
    HTTP.open("POST", url, true);
    HTTP.withCredentials = true;
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.send(JSON.stringify({"username": username, "password": password,}));
}

/**
 * Method to send a POST request with the username and password in order to logout.
 */
let postLogoutHTTPRequest = function (token) {
    const HTTP = new XMLHttpRequest();
    const url = "/users/logout";
    HTTP.onreadystatechange = function () {
        if (HTTP.readyState === HTTP.HEADERS_RECEIVED) {
            let cookies = HTTP.getResponseHeader("change-cookie")
            if (cookies != null) {
                let cookie = cookies.split("=");
                setCookie(cookie[0], "false");
                successfulLoginLogoutRegisterEffects("Successfully logged out.");
            }
            cookies = HTTP.getResponseHeader("delete-cookie");
            if (cookies != null)
                deleteCookie(cookies);
        }
        if (HTTP.readyState === HTTP.DONE) {
            console.error(HTTP.status)
            if (HTTP.status <= 300) {
                successfulLoginLogoutRegisterEffects("Successfully logged out. You will be redirected shortly");
            }
        }

    }
    HTTP.open("POST", url, true);
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.send(JSON.stringify({"token": token}));
}

/**
 * Method to send a PUT request with the username,email and password in order to register.
 * @param username the username to register with
 * @param email the email to register with
 * @param password the password to register with
 */
let putRegisterHTTPRequest = function (username, email, password) {
    const HTTP = new XMLHttpRequest();
    const url = "/users";
    HTTP.onreadystatechange = function () {
        if (HTTP.readyState === 4) {
            if (HTTP.status >= 400)
                changeSpanText(this.responseText, "red");
            else {
                changeSpanText(this.responseText, "green");
                successfulLoginLogoutRegisterEffects("Successfully sent registration request. You will be redirected shortly");
            }
        }
    }
    HTTP.open("PUT", url);
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.send(JSON.stringify({"username": username, "email": email, "password": password,}));
}

/**
 * Method to send a POST request with a token to check if the user is logged in or not.
 */
let postCheckIfUserIsLoggedHTTPRequest = function (token) {
    const HTTP = new XMLHttpRequest();
    const url = "/users/check";
    HTTP.onreadystatechange = function () {
        if (HTTP.readyState === HTTP.HEADERS_RECEIVED) {
            let cookies = HTTP.getResponseHeader("change-cookie")
            if (cookies != null) {
                let cookie = cookies.split("=");
                setCookie(cookie[0], cookie[1]);
            }
        }
        if (HTTP.readyState === HTTP.DONE) {
            if (HTTP.status < 300) {
                changeMenuBarBasedOnLoginLogout();
                if (HTTP.responseText !== "User is logged.")
                    deleteCookie("sessionID");
            }
        }
    }
    HTTP.open("POST", url, true);
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.setRequestHeader("Cookies", document.cookie);
    HTTP.send(JSON.stringify({"token": token}));
}

/**
 * This method is called to trigger the register request.
 */
function register() {
    const username = (document.querySelector("#username").value);
    const password = (document.querySelector("#password").value);
    const email = (document.querySelector("#email").value);

    if (checkMatches(username, password, email) !== false) {
        putRegisterHTTPRequest(username, email, password);
    }
}

/**
 * This method will be called to trigger the login.
 */
function login() {
    const username = (document.querySelector("#username").value);
    const password = (document.querySelector("#password").value);

    if (checkMatches(username, password) !== false) {
        postLoginHTTPRequest(username, password);
    }
}

/**
 * This method will be called to trigger the logout.
 */
function logout() {
    if (getCookie("sessionID") != null) {
        postLogoutHTTPRequest(getCookie("sessionID"));
    } else
        successfulLoginLogoutRegisterEffects("You were not logged in. Redirecting you to the main page");
    return false;
}

/**
 * This method will be called at the start of every session to check if the user is logged or not.
 */
function checkIfUserIsLogged() {
    let sessionID = getCookie("sessionID");
    if (sessionID != null)
        postCheckIfUserIsLoggedHTTPRequest(sessionID);
}

window.addEventListener("load", function () {
    checkIfUserIsLogged();
})
