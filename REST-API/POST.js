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
 * This method is responsible to keep the user logged in.
 */
let keepUserLoggedIn = async function (request, response) {
    return new Promise(async (resolve, refuse) => {
        //1. get the session ID from the cookie
        const rawHeader = request.rawHeaders.toString();
        const cookies = rawHeader.substring(rawHeader.indexOf("Cookie") + 7, rawHeader.length);

        let indexStart = cookies.indexOf("sessionID=");
        let indexStop = cookies.indexOf(";", indexStart + 1);
        let sessionID;

        if (indexStop !== -1)
            sessionID = cookies.substring(indexStart, indexStop);
        else
            sessionID = cookies.substring(indexStart + 10);

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
    try {
        const selectValue = await CRUD.selectTokenFromLoggedUsersTable(token);
        return token === selectValue;
    } catch (fail) {
        return false;
    }
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
            request.setHeader("change-cookie", "logged_in=false");
            setSuccessfulRequestResponse(request, response, "Successfully logged out.", 200);
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
    //let path = request.url.toString().substring(request.url.toString().indexOf("/", 2));
    let path = request.url.toString();
    if (path === "/users/login")
        login(request, response)
    else if (path === "/users/logout")
        logout(request, response)
    else if (path === "/dataset/eurostat" || (path === "/dataset/who"))
        modifyData(request, response);
    else {
        setFailedRequestResponse(request, response, "Bad POST request.", 400);
    }
}

module.exports.POST = POST;

