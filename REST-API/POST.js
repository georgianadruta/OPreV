const bcrypt = require('bcrypt')
const CRUD = require('./CRUD_operations')
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
 * Method responsible for dataset manipulation behaviour
 * @param request the request
 * @param response the response
 */
let modifyData = function (request, response) {
    setFailedRequestResponse(request, response, "Failed to modify dataset.")
}

/**
 * Method responsible for login behaviour
 * @param request the request
 * @param response the response
 */
let login = function (request, response) {
    setFailedRequestResponse(request, response, "Failed to login.", 404)
}

/**
 * Method for the login of any POST request
 * @param request the HTTP request
 * @param response the response
 */
function POST(request, response) {
    let path = request.url.toString().substring(request.url.toString().indexOf("/", 2));
    if (path === "/users")
        login(request, response)
    else if (path === "/dataset/eurostat" || (path === "/dataset/who"))
        modifyData(request, response);
    else {
        setFailedRequestResponse(request, response, "Bad POST request.", 400);
    }
}

module.exports.POST = POST;