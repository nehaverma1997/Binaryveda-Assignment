let config = {};

config.MONGO_URI =  'mongodb+srv://admin:admin@cluster0.yiwnqwo.mongodb.net/binaryveda_assignment?retryWrites=true&w=majority'; //If want to fetch from env file process.env.MONGO_URI;

config.mongoCollections = {
    users: "tb_users"
}

config.dbName = "binaryveda_assignment"

module.exports = config;