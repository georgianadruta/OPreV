const bcrypt = require('bcrypt')
const CRUD = require('./CRUD_operations')
const {getCookieValueFromCookies} = require('./REST_utilities')
const {setSuccessfulRequestResponse} = require('./REST_utilities')
const {setFailedRequestResponse} = require('./REST_utilities')
const {getQueryParamValueByName} = require('./REST_utilities')

/**
 * This method's purpose is to create a random sessionID
 * @return {string} a random sessionID
 */
let generateRandomID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

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
 * This method is responsible to keep the user logged in.
 */
let keepUserLoggedIn = async function (request, response, sessionID) {
    return new Promise(async (resolve, refuse) => {
        let IP = request.socket.localAddress;
        let jsonObject =
            {
                token: sessionID,
                IP: IP,
            }
        try {
            await CRUD.addUserToLoggedUsersTable(jsonObject);
            resolve("success");
        } catch (err) {
            console.log(err);
            refuse("User is already logged in.")
        }
    })

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
            bcrypt.compare(loginAccount.password, hashedPassword, async function (err, result) {
                if (result === true) {
                    try {
                        // TODO bypass CORS
                        // response.setHeader("Access-Control-Allow-Credentials", "true");
                        // response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
                        // response.setHeader("Vary", "Origin");
                        // response.setHeader("Access-Control-Allow-Headers", "Set-Cookie");
                        let randomID = generateRandomID();//create a random UUID
                        response.setHeader('Change-Cookie', 'sessionID=' + randomID);//
                        await keepUserLoggedIn(request, response, randomID);
                        setSuccessfulRequestResponse(request, response, "Login approved.", 202);
                    } catch (err) {
                        setFailedRequestResponse(request, response, "User is already logged in.", 409);
                    }
                } else
                    setFailedRequestResponse(request, response, "Wrong password.", 401);
            });
        } catch (err) {
            setFailedRequestResponse(request, response, err, 409);
        }
    });
}

/**
 * Method responsible for logout behaviour
 * @param request the request
 * @param response the response
 */
let logout = function (request, response) {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', async () => {
        let token = JSON.parse(body.toString());
        try {
            await CRUD.deleteLoggedUserFromTableByToken(token);
            response.setHeader('Delete-Cookie', 'sessionID');//
            setSuccessfulRequestResponse(request, response, "Successfully logged out.", 200);
        } catch (err) {
            setFailedRequestResponse(request, response, "Failed to log out.", 409);
        }
    });
}

/**
 * Method responsible for checking if the user is logged or not by token behaviour
 * @param request the request
 * @param response the response
 */
let check = function (request, response) {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', async () => {
        let jsonToken = JSON.parse(body.toString());
        try {
            await CRUD.selectTokenFromLoggedUsersTable(jsonToken.token).then(foundToken => {
                if (foundToken === jsonToken.token) {
                    setSuccessfulRequestResponse(request, response, "User is logged.", 200);
                } else {
                    setSuccessfulRequestResponse(request, response, "User is not logged.", 200);
                }
            });
        } catch (err) {
            setFailedRequestResponse(request, response, "Failed to check if users is logged or not.", 409);
        }
    });
}

/**
 * Method responsible for dataset manipulation behaviour
 * @param request the request
 * @param response the response
 */
let modifyData = function (request, response) {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', async () => {
        let sessionID = getCookieValueFromCookies(request, "sessionID");
        let jsonObject = JSON.parse(body.toString());
        try {
            await CRUD.selectTokenFromLoggedUsersTable(sessionID).then(async foundToken => {
                if (foundToken === sessionID) {
                    try {
                        let dataset = getQueryParamValueByName(request, "dataset");
                        let BMIIndicator = getQueryParamValueByName(request, "BMIFilter");
                        await CRUD.modifyDataInDataset(dataset, BMIIndicator, jsonObject.id, jsonObject.newBMI);
                        setSuccessfulRequestResponse(request, response, "Success", 200);
                    } catch (fail) {
                        setFailedRequestResponse(request, response, "Failed to modify data.", 500);
                    }
                } else {
                    setSuccessfulRequestResponse(request, response, "User is not logged.", 200);
                }
            });
        } catch (err) {
            setFailedRequestResponse(request, response, "Failed to check if users is logged or not.", 409);
        }
    });
}

/**
 * Method responsible for dataset manipulation behaviour
 * @param request the request
 * @param response the response
 */
let addToDataset = function (request, response) {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', async () => {
        let jsonObject = JSON.parse(body.toString());
        try {
            let arrayOfJson = await CRUD.addDataInDataset(getCookieValueFromCookies(request, "dataset"), 'obese', jsonObject);
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(arrayOfJson));
        } catch (fail) {
            setFailedRequestResponse(request, response, "Failed to add data.", 500);
        }
    });
}

/**
 * Method responsible for accepting a new user
 * @param request the request
 * @param response the response
 */
let acceptUser = function (request, response) {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', async () => {
        let sessionID = getCookieValueFromCookies(request, "sessionID");
        let jsonObject = JSON.parse(body.toString());
        try {
            await CRUD.selectTokenFromLoggedUsersTable(sessionID).then(async foundToken => {
                if (foundToken === sessionID) {
                    try {
                        await CRUD.acceptUsers(jsonObject);
                        setSuccessfulRequestResponse(request, response, "Success", 200);
                    } catch (fail) {
                        setFailedRequestResponse(request, response, "Failed to modify data.", 500);
                    }
                } else {
                    setSuccessfulRequestResponse(request, response, "User is not logged.", 200);
                }
            });
        } catch (err) {
            setFailedRequestResponse(request, response, "Failed to check if users is logged or not.", 409);
        }
    });
}


/**
 * Method for the login of any POST request
 * @param request the HTTP request
 * @param response the response
 */
function POST(request, response) {
    let path = request.url.toString();
    if (path.includes('?') === true) {
        path = path.substring(0, path.indexOf('?'));
    }
    switch (path) {
        case "/users/login": {
            login(request, response)
            break;
        }
        case "/users/logout": {
            logout(request, response)
            break;
        }
        case "/users/check": {
            check(request, response)
            break;
        }
        case "/dataset/eurostat" || "/dataset/who": {
            modifyData(request, response);
            break;
        }
        case "/dataset/add" : {
            addToDataset(request, response);
            return;
        }
        case "/users/requests": {
            acceptUser(request, response);
            break;
        }
        default: {
            setFailedRequestResponse(request, response, "Bad POST request.", 400);
        }
    }
}

module.exports.POST = POST;

