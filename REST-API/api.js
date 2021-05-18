const http = require('http');
const {URL} = require('url');
const fs = require('fs');
const path = require('path');
const isUrlValid = require('valid-url');

const PORT = process.env.PORT || 8081;
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.ico': 'image/x-icon',
};

let datasetPath = "/dataset";


http.createServer(function (request, response) {

    console.log(request.method, request.url);

    //check if url is valid
    if (isUrlValid.isUri(request.url)) {
        const myURL = new URL(request.url);
        if (myURL.pathname === datasetPath)
            switch (request.method) {
                case "GET": {
                    //TODO: GET logic
                    return;
                }
                case "POST": {
                    //TODO: POST logic
                    return;
                }
                case "PUT": {
                    //TODO: PUT logic
                    return;
                }
                case "DELETE": {
                    //TODO: DELETE logic
                    return;
                }
            }
    }

    //create file path
    let filePath = '.' + request.url;
    if (filePath === './')
        filePath = './index.html';

    try {
        if (fs.existsSync(filePath)) {
            //check if it's valid
            const extname = String(path.extname(filePath)).toLowerCase();
            const contentType = mimeTypes[extname] || 'application/octet-stream';// octet-stream is the default value if no mimeTypes is found
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    console.log("ERROR reading the file: " + filePath);
                    response.writeHead(404, {'Content-Type': contentType});
                    response.end(content, 'utf-8');
                } else {
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(content, 'utf-8');
                }
            });
        }
    } catch (err) {
        console.error(err)
    }
}).listen(PORT);
console.log('Server running at http://127.0.0.1:' + PORT);