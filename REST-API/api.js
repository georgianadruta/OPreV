const http = require('http');
const SERVER_ADDRESS = "127.0.0.1";
const PORT_SERVER = process.env.PORT || 8081;
const PORT_GET_MICROSERVICE = 8082;
const PORT_POST_MICROSERVICE = 8084;
const PORT_DELETE_MICROSERVICE = 8085;
const PORT_PUT_MICROSERVICE = 8086;

const {GET} = require('./GET')
const {POST} = require('./POST')
const {PUT} = require('./PUT')
const {DELETE} = require('./DELETE')
const CRUD = require('./CRUD_operations')

const GET_microservice = http.createServer(function (request, response) {
    GET(request, response);
}).listen(PORT_GET_MICROSERVICE, SERVER_ADDRESS, function () {
    const socket = GET_microservice.address();
    const host = socket.address;
    const port = socket.port;
    console.log('REST GET microservice running at ' + host + ':' + port)
});
const DELETE_microservice = http.createServer(function (request, response) {
    DELETE(request, response);
}).listen(PORT_DELETE_MICROSERVICE, SERVER_ADDRESS, function () {
    const socket = DELETE_microservice.address();
    const host = socket.address;
    const port = socket.port;
    console.log('REST DELETE microservice running at ' + host + ':' + port)
});
const PUT_microservice = http.createServer(function (request, response) {
    PUT(request, response);
}).listen(PORT_PUT_MICROSERVICE, SERVER_ADDRESS, function () {
    const socket = PUT_microservice.address();
    const host = socket.address;
    const port = socket.port;
    console.log('REST PUT microservice running at ' + host + ':' + port)
});
const POST_microservice = http.createServer(function (request, response) {
    POST(request, response);
}).listen(PORT_POST_MICROSERVICE, SERVER_ADDRESS, function () {
    const socket = POST_microservice.address();
    const host = socket.address;
    const port = socket.port;
    console.log('REST POST microservice running at ' + host + ':' + port)
});
const server = http.createServer(function (request, response) {

    console.log(request.method, request.url);
    request.setEncoding("utf8");
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

