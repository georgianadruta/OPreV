function POST(request, response) {
    //TODO logic of working with a POST response
    // WARNING:
    // Nothing will happen if you modify response itself.
    // But modifying it's fields (ex:response.name,response.head) will change response.
    if (request.url !== "/users") {
        console.error("ERROR: BAD REQUEST!  request:" + request.method + " " + request.url);
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end("Bad POST request.", 'utf-8');
        return;
    }
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        console.log('Finished processing POST body');
        let registrationAccount = JSON.parse(body.toString());

       
        response.writeHead(201, {'Content-Type': 'text/plain'});
        response.end("Added registration user to be verified by the host.", 'utf-8');
    })
}

module.exports.POST = POST;