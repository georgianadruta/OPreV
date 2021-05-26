/**
 * This method clears all content of the contact form once the task has been successful.
 */
let clearContentOfContactForm = function () {
    document.querySelector("#fullName").value = '';
    document.querySelector("#email").value = '';
    document.querySelector("#phone_number").value = '';
    document.querySelector("#message").value = '';
}

/**
 * This function's purpose is to change the text based on what happens with the form.
 * @param text the new text
 * @param color a color to change the text if specified. Or null otherwise
 */
let changeContactSpanText = function (text, color = null) {
    document.getElementById("spanContactTextBox").innerHTML = text;
    if (color !== null)
        document.getElementById("spanContactTextBox").style.color = color;
}

/**
 * This method checks if the parameters check regex patterns.
 * @param fullName the full name
 * @param email the email to check ( may be absent)
 * @param phone the phone number
 * @param message the message
 * @returns {boolean} true or false
 */
let checkContactMatches = function (fullName, email, phone, message) {
    let fullNameRegex = /^[A-ZÀ-ž][a-zÀ-ž]+(\s[A-ZÀ-ž][a-zÀ-ž]+(\s)*)*$/;
    if (fullNameRegex.test(fullName) === false) {
        changeContactSpanText("Invalid full name format.", "red");
        return false;
    }

    let emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (emailRegex.test(email) === false) {
        changeContactSpanText("Invalid email format.", "red")
        return false;
    }

    let phoneRegex = /^([+]{1})?[0-9]+$/;
    if (phoneRegex.test(phone) === false) {
        changeContactSpanText("Invalid full phone number.", "red");
        return false;
    }

    let messageRegex = /^.{20,500}$/;
    if (messageRegex.test(message) === false) {
        changeContactSpanText("Invalid full message format. The message should be at least 20 and at most 500 characters.", "red");
        return false;
    }

    return true;
}

/**
 * Method to send a POST request with the contact form..
 * @param fullName
 * @param email
 * @param phoneNumber
 * @param message
 */
let putContactHTTPRequest = function (fullName, email, phoneNumber, message) {
    const HTTP = new XMLHttpRequest();
    const url = "/contact/add";
    HTTP.onreadystatechange = function () {
        if (HTTP.readyState === HTTP.HEADERS_RECEIVED) {

        }
        if (HTTP.readyState === HTTP.DONE) {
            if (HTTP.status >= 400) {
                changeContactSpanText(this.responseText, "red");
            } else {
                changeContactSpanText(this.responseText, "green");
                clearContentOfContactForm()
            }
        }

    }
    HTTP.open("PUT", url, true);
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    HTTP.send(JSON.stringify({"fullName": fullName, "email": email, "phoneNumber": phoneNumber, "message": message}));
}

/**
 * Method responsible for the behaviour of the contact form.
 */
function contact() {
    const fullName = (document.querySelector("#fullName").value);
    const email = (document.querySelector("#email").value);
    const phone_number = (document.querySelector("#phone_number").value);
    const message = (document.querySelector("#message").value);

    if (checkContactMatches(fullName, email, phone_number, message) !== false) {
        putContactHTTPRequest(fullName, email, phone_number, message);
    }
}