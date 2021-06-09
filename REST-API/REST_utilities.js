/**
 * This method's purpose is to set the error message for the response if it fails.
 * @param request the request
 * @param response the response to be edited
 * @param responseMessage the error message
 * @param HTTPStatus the HTTP status (default 404)
 */
let setSuccessfulRequestResponse = function (request, response, responseMessage, HTTPStatus = 404) {
    response.writeHead(HTTPStatus, {'Content-Type': 'text/plain'});
    response.write(responseMessage, 'utf-8');
    response.end();
}

/**
 * This method's purpose is to set the error message for the response if it fails.
 * @param request the request
 * @param response the response to be edited
 * @param errorMessage the error message
 * @param HTTPStatus the HTTP status (default 404)
 */
let setFailedRequestResponse = function (request, response, errorMessage, HTTPStatus = 404) {
    response.writeHead(HTTPStatus, {'Content-Type': 'text/plain'});
    response.write(errorMessage, 'utf-8');
    response.end();
}

/**
 * This method is responsible for getting the value of the given cookie as parameter
 * @param request the request
 * @param cookieName the cookie's name
 * @return {string} the cookie's value string
 */
let getCookieValueFromCookies = function (request, cookieName) {
    const rawHeader = request.rawHeaders.toString();
    const cookies = rawHeader.substring(rawHeader.indexOf("Cookie") + 7, rawHeader.length);

    let indexStart = cookies.indexOf(cookieName);
    let cookieValue = cookies.substring(indexStart + cookieName.length + 1);

    let indexStop1 = cookieValue.indexOf(",");
    let indexStop2 = cookieValue.indexOf(";");
    if (indexStop1 !== -1)
        if (indexStop1 < indexStop2)
            return cookieValue.substring(0, indexStop1);
        else
            return cookieValue.substring(0, indexStop2);
    else if (indexStop2 !== -1)
        return cookieValue.substring(0, indexStop2);
    else
        return cookieValue;
}

/**
 * This function's purpose is to receive a query param's value by name from the request's url.
 * @param request
 * @param paramName
 */
function getQueryParamValueByName(request, paramName) {
    let query = decodeURIComponent(request.url);
    if (query.indexOf(paramName + '=') === -1) return '';
    query = query.substring(query.indexOf('?'));
    query = query.substring(query.indexOf(paramName + '=') + paramName.length + 1);
    let index = query.indexOf('&');
    if (index !== -1) {
        query = query.substring(0, index);
    }
    return query;
}

module.exports.getQueryParamValueByName = getQueryParamValueByName;
module.exports.getCookieValueFromCookies = getCookieValueFromCookies;
module.exports.setSuccessfulRequestResponse = setSuccessfulRequestResponse;
module.exports.setFailedRequestResponse = setFailedRequestResponse;