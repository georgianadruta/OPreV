const fs = require('fs');
const path = require('path');
const CRUD_operations = require("./CRUD_operations");

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.ico': 'image/x-icon',
};

/**
 * TODO IMPLEMENTATION
 * @param response
 */
let hardcoded_response = function (response) {
    const responseBody = 'Dataset request accepted.';
    response
        .writeHead(200, {
            'Content-Length': Buffer.byteLength(responseBody),
            'Content-Type': 'application/json'
        })
        .end(responseBody, "utf-8");
}

function displayNLine(N, path) {
    const lineReader = require('line-reader');
    let nr = -1;
    lineReader.eachLine(path, function (line) {
        nr++;
        if (nr === N) {
            console.log(line);
            return true;
        }
    });
}

function checkRequirementDataset(url, response) {
    const str = url.split("/");

    if (str[str.length - 1] === "dataset") {
        console.log("which dataset?")
    } else {
        if (str[str.length - 2] === "dataset") {
            if (str[str.length - 1] === "who") {
                CRUD_operations.changeConnectionDatabase("who");
                hardcoded_response(response);//TODO generate the actual response
                return true;
            } else {
                if (str[str.length - 1] === "eurostat") {
                    CRUD_operations.changeConnectionDatabase("eurostat");
                    hardcoded_response(response); //TODO generate the actual response
                    return true;
                }
            }
        } else {
            if (str[str.length - 3] === "dataset") {
                if (str[str.length - 2] === "eurostat") {
                    if (parseInt(str[str.length - 1]) >= 0) {
                        console.log("display " + parseInt(str[str.length - 1]) +
                            " element from " + str[str.length - 2] + " dataset");
                        displayNLine(parseInt(str[str.length - 1]), './Dataset/EuroStat-dataset.csv');
                    }
                } else {
                    if (str[str.length - 2] === "who") {
                        if (parseInt(str[str.length - 1]) >= 0) {
                            console.log("display " + parseInt(str[str.length - 1]) +
                                " element from " + str[str.length - 2] + " dataset");

                            //path hardcoded
                            displayNLine(parseInt(str[str.length - 1]), './Dataset/who.csv');

                        }
                    } else {
                        console.log("invalid dataset");
                    }
                }
            }
        }
    }
    return false;
}


function GET(request, response) {
    //TODO logic of working with a get response
    // WARNING:
    // Nothing will happen if you modify response itself.
    // But modifying it's fields (ex:response.name,response.head) will change response.

    if (checkRequirementDataset(request.url, response) === true)
        return;

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



