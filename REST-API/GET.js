const fs = require('fs');
const PATH = require('path')
const CRUD = require("./CRUD_operations");
const {getCookieValueFromCookies} = require('./REST_utilities')
const {setSuccessfulRequestResponse} = require('./REST_utilities')
const {setFailedRequestResponse} = require('./REST_utilities')
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
 * This method is responsible for returning both datasets as HTML response.
 * @param request the request
 * @param response the response
 * @param filters the filters used
 * @return {Promise<void>} unused promise
 */
let getDataset = async function (request, response, filters = "1=1") {
    let BMIIndicator = getCookieValueFromCookies(request, "BMIIndicator"); // table name
    let database = getCookieValueFromCookies(request, "dataset");
    //todo add filters from cookies
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

let getFilters = async function (request, response) {
    let jsonObject = {filter: getCookieValueFromCookies(request, "field")};
    let BMIIndicator = getCookieValueFromCookies(request, "BMIIndicator"); // table name
    let database = getCookieValueFromCookies(request, "dataset");
    try {
        let filters = await CRUD.getFiltersFromDataset(database, BMIIndicator, jsonObject.filter);
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
    switch (path) {
        case "/contact/messages": {
            getContactMessages(request, response);
            return;
        }
        case "/dataset/eurostat": { //      || "/dataset/who"
            getDataset(request, response);
            return;
        }
        case "/dataset/eurostat/filters" : { //     || "/dataset/who/filters"
            getFilters(request, response);
            return;
        }
        default: {
            let regex = new RegExp('/database/eurostat/[0-9]+') //if it's of form /database/eurostat/{some_number}
            if (regex.test(path)) {
                //TODO logic for /database/eurostat/2
                return;
            }

            regex = new RegExp('/database/who/[0-9]+')//if it's of form /database/who/{some_number}
            if (regex.test(path)) {
                //TODO logic for /database/eurostat/2
                return;
            }

            //create file path
            let filePath = '.' + request.url;
            if (filePath === './')
                filePath = './OPreV.html';

            //check if the file exists
            try {
                if (fs.existsSync(filePath)) {
                    const extname = String(PATH.extname(filePath)).toLowerCase();
                    const contentType = mimeTypes[extname] || 'application/octet-stream';// octet-stream is the default value if no mimeTypes is found
                    fs.readFile(filePath, function (error, content) {
                        if (error) {
                            console.log("ERROR reading the file: " + filePath);
                            setFailedRequestResponse(request, response, content, 404);
                        } else {
                            response.writeHead(200, {'Content-Type': contentType});
                            response.end(content, 'utf-8');
                        }
                    });
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



