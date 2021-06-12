const fs = require('fs');
const PATH = require('path')
const CRUD = require("./CRUD_operations");
const {getCookieValueFromCookies} = require('./REST_utilities')
const {setSuccessfulRequestResponse} = require('./REST_utilities')
const {setFailedRequestResponse} = require('./REST_utilities')
const {getQueryParamValueByName} = require('./REST_utilities')
const {isUserLoggedIn} = require('./REST_utilities')

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.ico': 'image/x-icon',
};

/**
 * THis function's purpose is to create the filters for the SQL WHERE clause.
 * The default value is 1=1 which is a mock clause since it's always true.
 * @param request the request
 */
function createFiltersFromQueryParams(request) {
    let clause = "1=1";
    let countries = getQueryParamValueByName(request, "countries");
    if (countries.length > 0) {
        const re = /(,)/g;
        const subst = '\'$1\'';
        clause += " AND country IN ('";
        countries = countries.replace(re, subst)
        clause += countries;
        clause += "') ";
    }
    let years = getQueryParamValueByName(request, "years");
    if (years.length > 0) {
        clause += " AND year IN (";
        clause += years;
        clause += ");";
    }
    return clause;
}

/**
 * This method is responsible for returning both datasets as HTML response.
 * @param request the request
 * @param response the response
 * @return {Promise<void>} unused promise
 */
let getDataset = async function (request, response) {
    let BMIIndicator = getQueryParamValueByName(request, "BMIFilter");
    let database = getQueryParamValueByName(request, "dataset");
    let filters = createFiltersFromQueryParams(request);
    try {
        let dataset = await CRUD.getDatasetDataFromTable(database, BMIIndicator, filters);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(dataset));
    } catch (fail) {
        setFailedRequestResponse(request, response, "Failed to select any data.", 404);
    }
}

/**
 * This methods returns all contact messages from the database.
 * @param request the request
 * @param response the response
 * @return {Promise<void>} a promise that resolves in all contact messages
 */
let getContactMessages = async function (request, response) {
    let sessionID = getCookieValueFromCookies(request, 'sessionID');
    try {
        await CRUD.selectTokenFromLoggedUsersTable(sessionID).then(async foundToken => {
            if (foundToken === sessionID) {
                try {
                    //check if user is logged first
                    let arrayOfJson = await CRUD.getContactMessagesFromContactMessagesTable();
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(arrayOfJson));
                } catch (failedMessage) {
                    setFailedRequestResponse(request, response, failedMessage, 404);
                }
            } else {
                response.setHeader("change-cookie", "logged_in=false");
                setSuccessfulRequestResponse(request, response, "User is not logged.", 200);
            }
        });
    } catch (err) {
        setFailedRequestResponse(request, response, "Failed to check if users is logged or not.", 409);
    }
}

/**
 * This methods returns all requested users from the database.
 * @param request the request
 * @param response the response
 * @return {Promise<void>} a promise that resolves in all requested users
 */
let getRequestedUsers = async function (request, response) {
    let sessionID = getCookieValueFromCookies(request, 'sessionID');
    try {
        await CRUD.selectTokenFromLoggedUsersTable(sessionID).then(async foundToken => {
            if (foundToken === sessionID) {
                try {
                    //check if user is logged first
                    let arrayOfJson = await CRUD.getRequestedUsersFromRegistrationRequestsTable();
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(arrayOfJson));
                } catch (failedMessage) {
                    setFailedRequestResponse(request, response, failedMessage, 404);
                }
            } else {
                response.setHeader("change-cookie", "logged_in=false");
                setSuccessfulRequestResponse(request, response, "User is not logged.", 200);
            }
        });
    } catch (err) {
        setFailedRequestResponse(request, response, "Failed to check if users is logged or not.", 409);
    }
}

/**
 * This function's purpose is to set the response to a JSON object Array containing the required fields specified in the query param
 * @param request the request
 * @param response the response
 * @return {Promise<void>} a new Promise
 */
let getFilters = async function (request, response) {
    let jsonObject = {filter: getQueryParamValueByName(request, "field")};
    let BMIIndicator = getQueryParamValueByName(request, "BMIFilter"); // table name
    let database = getQueryParamValueByName(request, "dataset");
    let region = getQueryParamValueByName(request, "RegionsFilter")
    if (region !== '' && database !== 'eurostat') {
        region = " WHERE region IN('" + region + "')";
    }
    try {
        let filters = await CRUD.getFiltersFromDataset(database, BMIIndicator, jsonObject.filter, region);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(filters));
    } catch (fail) {
        setFailedRequestResponse(request, response, "Failed to select any data.", 404);
    }


}

/**
 * Method responsible for all HTTP GET requests
 * @param request the request
 * @param response the response
 */
function GET(request, response) {
    let path = request.url.toString();
    if (path.includes('?') === true) {
        path = path.substring(0, path.indexOf('?'));
    }
    switch (path) {
        case "/contact/messages": {
            getContactMessages(request, response);
            return;
        }
        case "/dataset/eurostat":
        case "/dataset/who": {
            getDataset(request, response);
            return;
        }
        case "/dataset/eurostat/filters":
        case "/dataset/who/filters": {
            getFilters(request, response);
            return;
        }
        case "/users/requests" : {
            getRequestedUsers(request, response);
            return;
        }
        default: {
            //create file path
            let filePath = '.' + request.url;
            if (filePath === './')
                filePath = './OPreV.html';

            //check if the file exists
            try {
                if (fs.existsSync(filePath)) {
                    const extname = String(PATH.extname(filePath)).toLowerCase();
                    const contentType = mimeTypes[extname] || 'application/octet-stream';// octet-stream is the default value if no mimeTypes is found
                    if (filePath === "./admin.html") {
                        let sessionID = getCookieValueFromCookies(request, "sessionID");
                        if (sessionID != null && sessionID.length > 0)
                            isUserLoggedIn(sessionID).then(r => {
                                if (r === true)
                                    fs.readFile(filePath, function (error, content) {
                                        if (error) {
                                            console.log("ERROR reading the file: " + filePath);
                                            setFailedRequestResponse(request, response, content, 404);
                                        } else {
                                            response.writeHead(200, {'Content-Type': contentType});
                                            response.end(content, 'utf-8');
                                        }
                                    });
                                else
                                    setFailedRequestResponse(request, response, "You are not logged in. You cannot access admin page.", 403);
                            });
                    } else {
                        fs.readFile(filePath, function (error, content) {
                            if (error) {
                                console.log("ERROR reading the file: " + filePath);
                                setFailedRequestResponse(request, response, content, 404);
                            } else {
                                response.writeHead(200, {'Content-Type': contentType});
                                response.end(content, 'utf-8');
                            }
                        });
                    }
                } else {    //if the file doesn't exist then it's a bad REQUEST
                    setFailedRequestResponse(request, response, "BAD GET REQUEST", 400);
                }
            } catch (err) {
                console.error(err)
                setFailedRequestResponse(request, response, "Failed to read file", 404);
            }
        }
    }
}

module.exports.GET = GET;



