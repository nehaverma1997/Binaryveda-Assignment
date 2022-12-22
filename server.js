const express = require("express"),
    app = express(),
    swaggerJSDoc = require('swagger-jsdoc'),
    swaggerUi = require('swagger-ui-express'),
    cors = require("cors"),
    responseTime = require("response-time"),
    MongoClient = require('mongodb').MongoClient,
    config = require('./config/data');
    

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Binaryveda Assignment API Documentation"
        },
    },
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(
    responseTime(function (req, res, time) {
        console.log(`\n----Request body--->>`, req.body);
        console.log(`${req.method} ${res.statusCode} ${req.url}`, time, "ms");
    })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/user")(app);

app.get("/api/v1/liveness", function (req, res) {
    res.send("Welcome to Assignment");
});

const server = app.listen(3000, async (x, y) => {
    await startInitialProcess()
});

db = '';

async function startInitialProcess(){
    try{
        console.log('Express server listening on port ' + app.get('port'), "Env ",  app.get('env'));
        const client = new MongoClient(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});
        await client.connect();
        db = client.db(config.dbName);
    }catch(error){
        console.log("===> error", error);
    }
}

module.exports = {
    db
}