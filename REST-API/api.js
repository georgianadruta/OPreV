const http = require('http');
const PORT = process.env.PORT || 8081;

const DEBUG = 0;

const {GET} = require('./GET')
const {POST} = require('./POST')
const {PUT} = require('./PUT')
const {DELETE} = require('./DELETE')
const CRUD = require('./CRUD_operations')

let generateRandomID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

let createAssignSessionID = function (request, response) {
    const rawHeader = request.rawHeaders.toString();
    const cookies = rawHeader.substring(rawHeader.indexOf("Cookie") + 7, rawHeader.length);

    let indexStart = cookies.indexOf("sessionID=");
    if (indexStart !== -1)
        return;
    response.setHeader('Access-Control-Expose-Headers', 'set-cookie');
    response.setHeader('Set-Cookie', ['sessionID=' + generateRandomID()]);
}

http.createServer(function (request, response) {
    if (DEBUG === 1) {
        const rawHeader = request.rawHeaders.toString();
        const cookies = rawHeader.substring(rawHeader.indexOf("Cookie") + 7, rawHeader.length);
        console.log(request.method, request.url, "Cookies: " + cookies);
    } else
        console.log(request.method, request.url);
    request.setEncoding("utf8");
    createAssignSessionID(request, response);
    switch (request.method) {
        case "GET": {
            GET(request, response);
            break;
        }
        case "POST": {
            POST(request, response);
            break;
        }
        case "PUT": {
            PUT(request, response);
            break;
        }
        case "DELETE": {
            DELETE(request, response);
            break;
        }
    }

}).listen(PORT);
console.log('Server running at http://127.0.0.1:' + PORT);

async function clearLoggedUsersTable() {
    try {
        await CRUD.clearLoggedUsersTable();
    } catch (err) {
        console.log("Failed to clear out logged users table. REASON: " + err);
    }
}

// clearLoggedUsersTable().then(() => console.log("Cleared out logged users table."));