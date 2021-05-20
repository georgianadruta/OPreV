const http = require('http');
const PORT = process.env.PORT || 8081;

const DEBUG = 0;

const {GET} = require('./GET')
const {POST} = require('./POST')
const {PUT} = require('./PUT')
const {DELETE} = require('./DELETE')

http.createServer(function (request, response) {

    if (DEBUG === 1) {
        const rawHeader = request.rawHeaders.toString();
        const cookies = rawHeader.substring(rawHeader.indexOf("Cookie") + 7, rawHeader.length);
        console.log(request.method, request.url, "Cookies: " + cookies);
    } else
        console.log(request.method, request.url);

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