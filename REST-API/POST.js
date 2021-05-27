const bcrypt = require('bcrypt')
const CRUD = require('./CRUD_operations')
const {getCookieValueFromCookies} = require('./REST_utilities')
const {setSuccessfulRequestResponse} = require('./REST_utilities')
const {setFailedRequestResponse} = require('./REST_utilities')

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
let keepUserLoggedIn = async function (request, response) {
    return new Promise(async (resolve, refuse) => {
        //1. get the session ID from the cookie
        let sessionID = getCookieValueFromCookies(request, 'sessionID');

        let IP = request.socket.localAddress;
        // 2. store token for user with ip address
        let jsonObject =
            {
                token: sessionID,
                IP: IP,
            }
        try {
            await CRUD.addUserToLoggedUsersTable(jsonObject);
            // 3. set cookie token user
            response.setHeader('change-cookie', 'logged_in=true');
            // this cookie is only a flag
            // to check if it's even worth
            //searching for the user in the logged users database or not
            resolve("success");
        } catch (err) {
            console.log(err);
            refuse("User is already logged in.")
        }
    })

}

/**
 * This function checks whether the user with the given token is logged in or not
 * @param token the token to check the existence of in logged users table
 * @return true if user is logged in, false otherwise   !ATTENTION then return value of this function will be placed in .then function
 */
let isUserLoggedIn = async function (token) {
    const selectValue = await CRUD.selectTokenFromLoggedUsersTable(token);
    return token === selectValue;
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
                        await keepUserLoggedIn(request, response);
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
            response.setHeader("change-cookie", "logged_in=false");
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
                    response.setHeader("change-cookie", "logged_in=true");
                    setSuccessfulRequestResponse(request, response, "User is logged.", 200);
                } else {
                    response.setHeader("change-cookie", "logged_in=false");
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
        let sessionID = getCookieValueFromCookies(request,"sessionID");
        let jsonObject = JSON.parse(body.toString());
        try {
            await CRUD.selectTokenFromLoggedUsersTable(sessionID).then(async foundToken => {
                if (foundToken === sessionID) {
                    try {
                        await CRUD.modifyDataInDataset(getCookieValueFromCookies(request, "dataset"), getCookieValueFromCookies(request,"BMIIndicator"), jsonObject.id, jsonObject.newBMI);
                        setSuccessfulRequestResponse(request, response, "Success", 200);
                    } catch (fail) {
                        setFailedRequestResponse(request, response, "Failed to modify data.", 500);
                    }
                } else {
                    response.setHeader("change-cookie", "logged_in=false");
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
        default: {
            setFailedRequestResponse(request, response, "Bad POST request.", 400);
        }
    }
}

module.exports.POST = POST;

