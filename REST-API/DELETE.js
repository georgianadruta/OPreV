const CRUD = require('./CRUD_operations')
const {getCookieValueFromCookies} = require('./REST_utilities')
const {setSuccessfulRequestResponse} = require('./REST_utilities')
const {setFailedRequestResponse} = require('./REST_utilities')

async function deleteFromTableByID(request, response, callback, database, table) {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', async () => {
        let jsonObject = JSON.parse(body.toString());
        let sessionID = getCookieValueFromCookies(request, 'sessionID');
        try {
            //check if user is logged first
            await CRUD.selectTokenFromLoggedUsersTable(sessionID).then(async foundToken => {
                if (foundToken === sessionID) {
                    try {
                        await callback(database, table, jsonObject.id);
                    } catch (failedMessage) {
                        setFailedRequestResponse(request, response, "Failed to delete from database. REASON:" + failedMessage.sqlMessage.toString(), 404);
                    }
                    setSuccessfulRequestResponse(request, response, "Successfully deleted record.", 200);
                } else {
                    response.setHeader("change-cookie", "logged_in=false");
                    setSuccessfulRequestResponse(request, response, "User is not logged.", 200);
                }
            });
        } catch (err) {
            setFailedRequestResponse(request, response, "Failed to check if users is logged or not.", 409);
        }
    });
}

function DELETE(request, response) {
    let path = request.url.toString();
    switch (path) {
        case "/contact/messages": {
            deleteFromTableByID(request, response, CRUD.deleteFromTableByID, "contact", "contact_messages")
            break;
        }
        case "/dataset/who": {
            deleteFromTableByID(request, response, CRUD.deleteFromTableByID, "who", "TODO")
            break;
        }
        case "/dataset/eurostat": {
            deleteFromTableByID(request, response, CRUD.deleteFromTableByID, "eurostat", "obese")
            break;
        }
        case "/users/requests": {
            deleteFromTableByID(request, response, CRUD.deleteFromTableByID, "users", "registration_requests")
            break;
        }
        default: {
            setFailedRequestResponse(request, response, "Bad POST request.", 400);
        }
    }
}

module.exports.DELETE = DELETE;