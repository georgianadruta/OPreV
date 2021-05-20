const fs = require('fs');
const path = require('path');

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

function GET(request, response) {
    //TODO logic of working with a get response
    // WARNING:
    // Nothing will happen if you modify response itself.
    // But modifying it's fields (ex:response.name,response.head) will change response.


    //if we find /dataset in url
    if (String(request.url).search(datasetPath) !== -1) {
        //TODO logic if url contains /dataset
    } else {

        //create file path
        let filePath = './website' + request.url;
        if (filePath === './website/')
            filePath = './website/OPreV.html';//first page to load


        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';// octet-stream is the default value if no mimeTypes is found

        try {
            if (fs.existsSync(filePath)) {
                //check if it's valid
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
            console.error(err);

            console.log("ERROR reading the file: " + filePath);
            response.writeHead(404, {'Content-Type': contentType});
            response.end("file doesnt exist.", 'utf-8');
        }
    }
}

module.exports.GET = GET;
