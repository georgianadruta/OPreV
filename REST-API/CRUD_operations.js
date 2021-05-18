const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:parola@cluster0.ibcsn.mongodb.net/OPreVDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

var database = "OPreVDB";
var collectionName = "test";

const addObject = function (jsonObjectString) {
    client.connect().then(() => {
        const collection = client.db(database).collection(collectionName);
        // perform actions on the collection object
        const jsonObject = JSON.parse(jsonObjectString);
        collection.insertOne(jsonObject).then(function () {
            console.log("Added " + jsonObjectString + " to database '" + database + "' in collection '" + collectionName + "'.");
            client.close();
        }).catch(function () {
            console.log("Failed to add " + jsonObjectString + " to database '" + database + "' in collection '" + collectionName + "'.");
            client.close();
        });
    }).catch(() => console.log("Failed to connect client."));
};

const deleteObjectByID = function (jsonObjectString) {
    client.connect().then(() => {
        const collection = client.db(database).collection(collectionName);
        // perform actions on the collection object
        const jsonObject = JSON.parse(jsonObjectString);
        collection.deleteOne({"id": jsonObject.id}).then(function () {
            console.log("Deleted " + jsonObjectString + " in database '" + database + "' in collection '" + collectionName + "'.");
            client.close();
        }).catch(function () {
            console.log("Failed to delete " + jsonObjectString + " in database '" + database + "' in collection '" + collectionName + "'.");
            client.close();
        });
    }).catch(() => console.log("Failed to connect client."));
};

const updateObjectByID = function (jsonObjectString) {
    client.connect().then(() => {
        const collection = client.db(database).collection(collectionName);
        // perform actions on the collection object
        const jsonObject = JSON.parse(jsonObjectString);
        collection.updateOne({"id": jsonObject.id}, {
            $set: {
                name:
                jsonObject.name,
            },//TODO add other fields
        }).then(function () {
            console.log("Updated " + jsonObjectString + " in database '" + database + "' in collection '" + collectionName + "'.");
            client.close();
        }).catch(function () {
            console.log("Failed to update " + jsonObjectString + " in database '" + database + "' in collection '" + collectionName + "'.");
            addObject(jsonObjectString);
            client.close();
        });
    }).catch(() => console.log("Failed to connect client."));
};


// let globalVar = "{}";
// const getObjectByID_JSON = function (jsonObjectString) {
//     client.connect().then(() => {
//         const collection = client.db(database).collection(collectionName);
//         // perform actions on the collection object
//         const jsonObject = JSON.parse(jsonObjectString);
//         globalVar = collection.findOne({"id": {$eq: jsonObject.id}}
//         ).then(function () {
//             console.log("Found " + jsonObjectString + " in database '" + database + "' in collection '" + collectionName + "'.");
//             client.close();
//         }).catch(function () {
//             console.log("Failed to get " + jsonObjectString + " in database '" + database + "' in collection '" + collectionName + "'.");
//             client.close();
//         });
//     }).catch(() => console.log("Failed to connect client."));
}
;

// addObject('{"id":2, "name":"John"}');
// updateObjectByID('{"id":2, "name":"Maria"}');

// getObjectByID_JSON('{"id":2}');