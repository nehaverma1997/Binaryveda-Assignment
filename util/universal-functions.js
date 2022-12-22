const Joi = require('joi'),
        boom = require("@hapi/boom"),
        bcrypt = require('bcryptjs'),
        jwt = require('jsonwebtoken');

function validateSchema(req, res, next, schema) {
    const { value, error } = schema.validate(req.body, { abortEarly: false });
    const valid = error == null;
    if (valid) {
        req.body = value;
        next();
    } else {
        const e = boom.badRequest(sanitizeJoiError(error.message)).output.payload;
        res.status(e.statusCode).send(e);
    }
}

function sendError(res, error) {
    let errorObj = {
        error: (error && (error.error && (error.error.message || error.error))) || "Bad Request",
        statusCode: (error && error.statusCode) || 400,
        message: (error && ((error.error && error.error.message) || error.message)) || "Bad Request"
    };
    if (error.isBoom) {
        errorObj = error.output.payload;
    }
    else if (error.name == "JsonWebTokenError") {
        errorObj.error = "JsonWebTokenError";
    }

    if (error && error.data) {
        errorObj.data = error.data;
    }

    res.status(errorObj.statusCode).send(errorObj);
}

function sendSuccess(res, data, message, statusCode) {
    const response = {
        data: data || {},
        statusCode: statusCode || 200,
        message: message || "SUCCESS"
    };
    res.status(response.statusCode).send(response);
}

const hashPasswordUsingBcrypt = function (plainTextPassword) {
    const saltRounds = 10;
    return bcrypt.hashSync(plainTextPassword, saltRounds);
};

const comparePasswordUsingBcrypt = function (plainTextPassword, passwordhash) {
    return bcrypt.compareSync(plainTextPassword, passwordhash);
};

function generateToken(data) {
    data.date = new Date();
    return jwt.sign(data, "sUPerSeCuREKeY&^$^&$^%$^%7782348723t4872t34Ends");
}

module.exports = {
    validateSchema,
    sendError,
    sendSuccess,
    hashPasswordUsingBcrypt,
    comparePasswordUsingBcrypt,
    generateToken
}