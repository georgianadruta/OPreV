const http = require('http');
const SERVER_ADDRESS = "127.0.0.1";
const PORT_SERVER = process.env.PORT || 8081;
const PORT_GET_MICROSERVICE = 8082;
const PORT_POST_MICROSERVICE = 8084;
const PORT_PUT_MICROSERVICE = 8086;
const PORT_DELETE_MICROSERVICE = 8085;

const {GET} = require('./GET')
const {POST} = require('./POST')
const {PUT} = require('./PUT')
const {DELETE} = require('./DELETE')
const CRUD = require('./CRUD_operations')
const {setFailedRequestResponse} = require("./REST_utilities");

function createOptionsForRequest(request) {
    let options = {
        hostname: "",
        path: request.url,
        method: request.method,
    };
    switch (request.method) {
        case "GET":
            options["port"] = PORT_GET_MICROSERVICE;
            break;
        case "POST":
            options["port"] = PORT_POST_MICROSERVICE;
            break;
        case "PUT":
            options["port"] = PORT_PUT_MICROSERVICE;
            break;
        case "DELETE":
            options["port"] = PORT_DELETE_MICROSERVICE;
            break;
        default:
            return null;
    }
    options["headers"] = request.headers;
    return options;
}

const GET_microservice = http.createServer(function (request, response) {
    console.log("GET_ms:    ", request.method, request.url)
    GET(request, response);
}).listen(PORT_GET_MICROSERVICE, SERVER_ADDRESS, function () {
    const socket = GET_microservice.address();
    const host = socket.address;
    const port = socket.port;
    console.log('REST GET microservice running at ' + host + ':' + port)
});
const DELETE_microservice = http.createServer(function (request, response) {
    console.log("DELETE_ms:    ", request.method, request.url)
    DELETE(request, response);
}).listen(PORT_DELETE_MICROSERVICE, SERVER_ADDRESS, function () {
    const socket = DELETE_microservice.address();
    const host = socket.address;
    const port = socket.port;
    console.log('REST DELETE microservice running at ' + host + ':' + port)
});
const PUT_microservice = http.createServer(function (request, response) {
    console.log("PUT_ms:    ", request.method, request.url)
    PUT(request, response);
}).listen(PORT_PUT_MICROSERVICE, SERVER_ADDRESS, function () {
    const socket = PUT_microservice.address();
    const host = socket.address;
    const port = socket.port;
    console.log('REST PUT microservice running at ' + host + ':' + port)
});
const POST_microservice = http.createServer(function (request, response) {
    console.log("POST_ms:    ", request.method, request.url)
    POST(request, response);
}).listen(PORT_POST_MICROSERVICE, SERVER_ADDRESS, function () {
    const socket = POST_microservice.address();
    const host = socket.address;
    const port = socket.port;
    console.log('REST POST microservice running at ' + host + ':' + port)
});
const server = http.createServer(function (request, response) {

    request.setEncoding("utf8");
    const options = createOptionsForRequest(request);

    if (options == null) {
        setFailedRequestResponse(request, response, "BAD REQUEST", 400);
        return;
    }

    try {
        let body = '';
        request.on('data', chunk => {
            body += chunk;
        });
        request.on('end', async () => {
            const req = http.request(options, function (microServiceResponse) {
                body = '';
                microServiceResponse.on('data', function (chunk) {
                    body += chunk;
                });

                microServiceResponse.on('end', function () {
                    let headers = {};
                    for (const key of Object.keys(microServiceResponse.headers)) {
                        headers[key] = microServiceResponse.headers[key];
                    }
                    response.writeHead(microServiceResponse.statusCode, headers);
                    response.write(body);
                    response.end();
                });
            });
            req.write(body);
            req.end();
        });
    } catch (error) {
        setFailedRequestResponse(request, response, "Error: " + error);
    }

}).listen(PORT_SERVER, SERVER_ADDRESS, function () {
    const socket = server.address();
    const host = socket.address;
    const port = socket.port;
    console.log('Server running at http://' + host + ':' + port)
});

/**
 * This method's purpose is to clear out logged users table once the server starts to listen to clients.
 * @return {Promise<void>}
 */
async function clearLoggedUsersTable() {
    try {
        await CRUD.clearLoggedUsersTable();
    } catch (err) {
        console.log("Failed to clear out logged users table. REASON: " + err);
    }
}

//call it at the beginning of the server
clearLoggedUsersTable().then(() => console.log("Cleared out logged users table."));

module.exports.server = server.address();

