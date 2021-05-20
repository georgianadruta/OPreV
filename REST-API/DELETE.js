function DELETE(request, response) {
    //TODO logic of working with a DELETE response
    // WARNING:
    // Nothing will happen if you modify response itself.
    // But modifying it's fields (ex:response.name,response.head) will change response.


    console.error("ERROR: BAD REQUEST!  request:" + request.method + " " + request.url);
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end("Bad DELETE request.", 'utf-8');
}

module.exports.DELETE = DELETE;