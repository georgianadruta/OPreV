const bcrypt = require('bcrypt')
const CRUD = require('./CRUD_operations')

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

    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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
    const encryptedPassword = await bcrypt.hash(password, salt);
    // console.log(salt, encryptedPassword);
    return encryptedPassword;
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
        console.log('Finished processing PUT body');
        let registrationAccount = JSON.parse(body.toString());
        try {
            checkMatches(registrationAccount.username, registrationAccount.email, registrationAccount.password);
        } catch (err) {
            console.error("ERROR: " + err + "request:" + request.method + " " + request.url);
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end("ERROR: " + err, 'utf-8');
            return;
        }
        getEncryptedPassword(registrationAccount.password).then(
            function (encryptedPassword) {
                registrationAccount.password = encryptedPassword;
                CRUD.addRegistrationUser(registrationAccount);//TODO check if it fails
                response.writeHead(201, {'Content-Type': 'text/plain'});
                response.end("Added registration user to be verified by the host.", 'utf-8');
            })
            .catch(function (error) {
                console.error("ERROR: " + error + " Filed to encrypt password." + "request:" + request.method + " " + request.url);
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end("ERROR: " + error + " Filed to encrypt password.", 'utf-8');
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
        console.error("ERROR: BAD REQUEST!  request:" + request.method + " " + request.url);
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end("Bad PUT request.", 'utf-8');
    }
}

module.exports.PUT = PUT;