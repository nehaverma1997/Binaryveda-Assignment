module.exports = function (app) {
    const Joi = require("joi");
    const controller = require("../controllers/user"),
        universalFunctions = require("../util/universal-functions");

    /**
     * @swagger
     * /v1/user/sign-up:
     *  post:
     *     tags:
     *       - user
     *     description: 
     *       - sign up for users
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: email
     *         description: email
     *         in: formData
     *         required: true
     *         type: string
     *       - name: password
     *         in: formData
     *         required: true
     *         type: string
     *       - name: first_name
     *         description: firstname of the user
     *         in: formData
     *         required: true
     *         type: string
     *       - name: last_name
     *         description: lastname of the user.
     *         in: formData
     *         required: true  
     *         type: string 
     *       - name: age
     *         description: age of the user.
     *         in: formData
     *         required: true  
     *         type: number
     *       - name: address
     *         description: address of the user.
     *         in: formData
     *         required: true 
     *         type: string
     *     responses:
     *      '200':
     *       description: A successful response
     */

    app.post(
        "/v1/user/sign-up",
        (req, res, next) => {
            const schema = Joi.object().keys({
                email: Joi.string().email().required().lowercase(),
                password: Joi.string().required(),
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                age: Joi.number().required(),
                address: Joi.string().required()
            });
            universalFunctions.validateSchema(req, res, next, schema);
        },
        controller.userSignUp
    );

    /**
     * @swagger
     * /v1/user/login:
     *  post:
     *     tags:
     *       - user
     *     description: 
     *       - login api for users
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: email
     *         description: email
     *         in: formData
     *         required: true
     *         type: string
     *       - name: password
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *      '200':
     *       description: A successful response
     */

    app.post(
        "/v1/user/login",
        (req, res, next) => {
            const schema = Joi.object().keys({
                email: Joi.string().email().required().lowercase(),
                password: Joi.string().required()
            });
            universalFunctions.validateSchema(req, res, next, schema);
        },
        controller.userLogin
    );
}