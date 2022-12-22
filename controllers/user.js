const Boom = require("@hapi/boom"),
    universalFunctions = require("../util/universal-functions"),
    config = require('../config/data'),
    ERROR_MESSAGES = require('../config/error-messages');



async function userSignUp(req, res) {
    try {
        const data = req.body;

        const dataToInsert = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: universalFunctions.hashPasswordUsingBcrypt(data.password),
            age: data.age,
            address: data.address,
            access_token: universalFunctions.generateToken({ email: data.email })
        }

        let queryResult = await db.collection(config.mongoCollections.users).findOne({ "email": data.email });

        if (queryResult) {
            throw Boom.badRequest(ERROR_MESSAGES.USER_ALREADY_EXISTS_EMAIL)
        } else {
            queryResult = await db.collection(config.mongoCollections.users).insertOne(dataToInsert);

        }

        universalFunctions.sendSuccess(res);

    } catch (error) {
        console.log("---------------userSignUp ERROR----------------", JSON.stringify(error, ["message", "arguments", "type", "name", "constraint"]));
        universalFunctions.sendError(res, error);
    }
}

async function userLogin(req, res) {
    try {
        const data = req.body;

        let queryResult = await db.collection(config.mongoCollections.users).findOne({ "email": data.email}, {email: 1, password: 1});

        if (queryResult) {
            const passwordResult = await universalFunctions.comparePasswordUsingBcrypt(
                data.password,
                queryResult.password
            );

            if (!passwordResult)
                throw Boom.unauthorized(ERROR_MESSAGES.INVALID_LOGIN_CREDENTIALS);

            queryResult = (await db.collection(config.mongoCollections.users).findOneAndUpdate(
                {_id: queryResult._id}, 
                {$set: { access_token : universalFunctions.generateToken({ email: data.email })}},
                {upsert: true, projection: { "email" : 1, "first_name" : 1, "last_name" : 1, "age": 1, "address": 1, "access_token": 1}}
            )).value;

        } else {
            throw Boom.badRequest(ERROR_MESSAGES.INVALID_LOGIN_CREDENTIALS)
        }

        universalFunctions.sendSuccess(res, queryResult);

    } catch (error) {
        console.log("---------------userLogin ERROR----------------", JSON.stringify(error, ["message", "arguments", "type", "name", "constraint"]));
        universalFunctions.sendError(res, error);
    }
}

module.exports = {
    userSignUp,
    userLogin
}