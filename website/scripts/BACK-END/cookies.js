/**
 * This function's purpose is to create a new cookie with the parameters specified.
 * @param cookieName the name of the cookie
 * @param cookieValue the value of the cooke
 * @param expireMinutes an expiration date on minutes. Default no expiry date (session cookie)
 */
function setCookie(cookieName, cookieValue, expireMinutes = 1) {
    let expires;
    if (expireMinutes != null) {
        const d = new Date();
        d.setTime(d.getTime() + (expireMinutes * 60 * 60 * 1000));
        expires = "expires=" + d.toUTCString();
    }
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ';path=/';
}

/**
 * This function's purpose is to return a string with the cookie named cookieName or null if no cookie exists with that name
 * @param cookieName the name of the cookie
 * @returns {string|null} a string containing the cookie OR null if no cookies exists with that name
 */
function getCookie(cookieName) {
    const name = cookieName + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

/**
 * This method's purpose is to generate a random ID.
 * @returns {string} random UUID
 */
let generateRandomID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

window.addEventListener("load", function () {
    if (getCookie('sessionID') == null) setCookie("sessionID", generateRandomID());
    if (getCookie('logged_in') == null) setCookie("logged_in", 'false');
});
