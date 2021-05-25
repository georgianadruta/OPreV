let login = function (request, response) {
}
let modifyData = function (request, response) {
}

function POST(request, response) {
    //TODO logic of working with a POST response
    if (request.url === "/users")
        login(request, response)
    else if (request.url === "/dataset/eurostat" || (request.url === "/dataset/who"))
        modifyData(request, response);
    else {
        console.error("ERROR: BAD REQUEST!  request:" + request.method + " " + request.url);
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end("Bad POST request.", 'utf-8');
    }
}

module.exports.POST = POST;