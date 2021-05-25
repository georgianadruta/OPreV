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
 * This method checks if the parameters check regex patterns.
 * @param username the username to check
 * @param password the password to check
 * @param email the email to check ( may be absent)
 * @returns {boolean}
 */
let checkMatches = function (username, password, email = null) {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (usernameRegex.test(username) === false) {
        return false;
    }

    if (email != null) {
        let emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (emailRegex.test(email) === false) {
            return false;
        }
    }

    let passwordRegex = /^[A-Za-z]\w{7,14}$/;
    return passwordRegex.test(password) !== false;
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
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', async () => {
        let loginAccount = JSON.parse(body.toString());
        try {
            checkMatches(loginAccount.username, loginAccount.password);
        } catch (err) {
            setFailedRequestResponse(err, 406);
            return;
        }
        try {
            const hashedPassword = await CRUD.getUserHashedPassword(loginAccount);
            bcrypt.compare(loginAccount.password, hashedPassword, function (err, result) {
                if (result === true)
                    setSuccessfulRequestResponse(request, response, "Login approved.", 202);
                else
                    setFailedRequestResponse(request, response, "Wrong password.", 401);
            });
        } catch (err) {
            setFailedRequestResponse(request, response, err, 409);
        }
    });
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