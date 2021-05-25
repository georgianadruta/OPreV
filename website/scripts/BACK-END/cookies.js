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
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
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
 * This method's purpose is to generate a random UUID.
 * @returns {string} random UUID
 */
function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();//Timestamp
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

window.addEventListener("load", function () {
    setCookie("sessionID", generateUUID());
});
