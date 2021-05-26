const bcrypt = require('bcrypt')
const CRUD = require('./CRUD_operations')

const {setSuccessfulRequestResponse} = require('./REST_utilities')
const {setFailedRequestResponse} = require('./REST_utilities')

/**
 * This method checks if the parameters check regex patterns.
 * @param username the username to check
 * @param password the password to check
 * @param email the email to check ( may be absent)
 * @returns {boolean}
 */
let checkAccountMatches = function (username, password, email = null) {
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
        return false;
    }

    let emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (emailRegex.test(email) === false) {
        return false;
    }

    let phoneRegex = /^([+])?[0-9]+$/;
    if (phoneRegex.test(phone) === false) {
        return false;
    }

    let messageRegex = /^.{20,500}$/;
    return messageRegex.test(message) !== false;


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
            checkAccountMatches(registrationAccount.username, registrationAccount.email, registrationAccount.password);
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
 * The method response for an put request to the registration users
 * @param request the request
 * @param response the response
 */
let addContactMessage = function (request, response) {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', async () => {
        let contactFormulary = JSON.parse(body.toString());
        try {
            checkContactMatches(contactFormulary.fullName, contactFormulary.email, contactFormulary.phoneNumber, contactFormulary.message);
        } catch (err) {
            setFailedRequestResponse(err, 406);
            return;
        }

        try {
            await CRUD.addContactMessageToContactMessagesTable(contactFormulary);
            setSuccessfulRequestResponse(request, response, "Successfully sent contact formulary.", 201);
        } catch (err) {
            setFailedRequestResponse(request, response, err, 409);
        }
    });
}

/**
 * TODO
 * The method response for an put request to the datasets
 * @param request the request
 * @param response the response
 */
let addDatasetData = function (request, response) {
    setFailedRequestResponse(request, response, "NOT IMPLEMENTED YET", 400);
}

/**
 * This method is responsible for handling any PUT request.
 * @param request the request
 * @param response the response
 */
function PUT(request, response) {
    let path = request.url.toString();
    switch (path) {
        case "/users": {
            addRegistrationUser(request, response);
            break;
        }
        case "/contact/add": {
            addContactMessage(request, response);
            break;
        }
        case "/dataset/eurostat" || "/dataset/who": {
            addDatasetData(request, response);
            break;
        }
        default: {
            setFailedRequestResponse(request, response, "Bad PUT request.", 400);
        }
    }
}

module.exports.PUT = PUT;
