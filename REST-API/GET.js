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

function checkRequirementDataset(url) {
    const str = url.split("/");

    if (str[str.length - 1] === "dataset") {
        console.log("which dataset?")
    } else {
        if (str[str.length - 2] === "dataset") {
            if (str[str.length - 1] === "who") {
                console.log("display who dataset")
            } else {
                if (str[str.length - 1] === "eurostat") {
                    console.log("display eurostat dataset")
                }
            }
        } else {
            if (str[str.length - 3] === "dataset") {
                if (str[str.length - 2] === "eurostat" || str[str.length - 2] === "who") {
                    if (parseInt(str[str.length - 1]) >= 0) {
                        console.log("display " + parseInt(str[str.length - 1]) +
                            " element from " + str[str.length - 2] + " dataset");
                    }
                } else {
                    console.log("invalid dataset");
                }
            }
        }
    }
}

function GET(request, response) {
    // TODO logic of working with a get response
    // WARNING:
    // Nothing will happen if you modify response itself.
    // But modifying it's fields (ex:response.name,response.head) will change response.

    checkRequirementDataset(request.url);

    //create file path
    let filePath = '.' + request.url;
    if (filePath === './')
        filePath = './OPreV.html';

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
}

module.exports.GET = GET;
