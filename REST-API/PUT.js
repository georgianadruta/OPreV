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
 * This method checks if parameters match the regex patterns.
 * @param username the username to be checked
 * @param email the email to be checked
 * @param password the password to be checked
 */
let checkMatches = function (username, email, password) {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (usernameRegex.test(username) === false) {
        throw "Invalid username pattern."
    }

    let emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (emailRegex.test(email) === false) {
        throw "Invalid email pattern."
    }
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (passwordRegex.test(password) === false) {
        throw "Invalid password pattern."
    }
}

/**
 * This method returns a encrypted version of the parameter password
 * @param password the password to be encrypted
 * @returns {Promise<*>} a promise
 */
let getEncryptedPassword = async function (password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}

/**
 * The method response for an put request to the registration users
 * @param request the request
 * @param response the response
 */
let addRegistrationUser = function (request, response) {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        let registrationAccount = JSON.parse(body.toString());
        try {
            checkMatches(registrationAccount.username, registrationAccount.email, registrationAccount.password);
        } catch (err) {
            setFailedRequestResponse(err, 406);
            return;
        }
        getEncryptedPassword(registrationAccount.password).then(
            async function (encryptedPassword) {
                registrationAccount.password = encryptedPassword;
                try {
                    await CRUD.addRegistrationUser(registrationAccount);
                    setSuccessfulRequestResponse(request, response, "Added registration user to be verified by the host.", 201);
                } catch (err) {
                    setFailedRequestResponse(request, response, err, 409);
                }
            })
            .catch(function (error) {
                setFailedRequestResponse(request, response, error, 500);
            })
    })
}

/**
 * The method response for an put request to the datasets
 * @param request the request
 * @param response the response
 */
let addDatasetData = function (request, response) {
}

function PUT(request, response) {
    let path = request.url.toString().substring(request.url.toString().indexOf("/", 2));
    if (path === "/users")
        addRegistrationUser(request, response);
    else if (path === "/dataset/eurostat" || (path === "/dataset/who"))
        addDatasetData(request, response);
    else {
        setFailedRequestResponse(request, response, "BAD request", 400)
    }
}

module.exports.PUT = PUT;