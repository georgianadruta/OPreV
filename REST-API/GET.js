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
 * TODO IMPLEMENTATION
 * @param response
 * @param cookie
 */
let hardcoded_response = function (response, cookie) {
    const responseBody = 'Dataset request accepted.';
    response
        .writeHead(200, {
            'Content-Length': Buffer.byteLength(responseBody),
            'Content-Type': 'application/json'
        })
        .end(responseBody, "utf-8");
}

function displayNLine(N, path) {
    const lineReader = require('line-reader');
    let nr = -1;
    lineReader.eachLine(path, function (line) {
        nr++;
        if (nr === N) {
            console.log(line);
            return true;
        }
    });
}

function checkRequirementDataset(request, response) {
    const str = request.url.split("/");

    if (str[str.length - 1] === "dataset") {
        console.log("which dataset?")
    } else {
        if (str[str.length - 2] === "dataset") {
            if (str[str.length - 1] === "who") {
                hardcoded_response(response, request.cookie);//TODO generate the actual response
                return true;
            } else {
                if (str[str.length - 1] === "eurostat") {
                    hardcoded_response(response, request.cookie); //TODO generate the actual response
                    return true;
                }
            }
        } else {
            if (str[str.length - 3] === "dataset") {
                if (str[str.length - 2] === "eurostat") {
                    if (parseInt(str[str.length - 1]) >= 0) {
                        console.log("display " + parseInt(str[str.length - 1]) +
                            " element from " + str[str.length - 2] + " dataset");
                        displayNLine(parseInt(str[str.length - 1]), './Dataset/EuroStat-dataset.csv');
                    }
                } else {
                    if (str[str.length - 2] === "who") {
                        if (parseInt(str[str.length - 1]) >= 0) {
                            console.log("display " + parseInt(str[str.length - 1]) +
                                " element from " + str[str.length - 2] + " dataset");

                            //path hardcoded
                            displayNLine(parseInt(str[str.length - 1]), './Dataset/who.csv');

                        }
                    } else {
                        console.log("invalid dataset");
                    }
                }
            }
        }
    }
    return false;
}

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
 * Method responsible for all HTTP GET requests
 * @param request the request
 * @param response the response
 */
function GET(request, response) {
    let path = request.url.toString();
    switch (path) {
        case "/contact/messages": {
            getContactMessages(request, response);
            break;
        }
        case "/dataset/eurostat": {
            setFailedRequestResponse(request, response, "NOT IMPLEMENTED YET", 200);
            break;
        }
        case "/dataset/who": {
            setFailedRequestResponse(request, response, "NOT IMPLEMENTED YET", 200);
            break;
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



