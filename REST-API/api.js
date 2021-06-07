const http = require('http');
const SERVER_ADDRESS = "127.0.0.1";
const PORT = process.env.PORT || 8081;

const {GET} = require('./GET')
const {POST} = require('./POST')
const {PUT} = require('./PUT')
const {DELETE} = require('./DELETE')
const CRUD = require('./CRUD_operations')

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

}).listen(PORT, SERVER_ADDRESS, function () {
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

