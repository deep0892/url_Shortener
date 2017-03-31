var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://10.0.8.62:27017/URLShortDB');
// create instance of Schema
var mongoSchema = mongoose.Schema;
// create schema
var urlSchema = {
    "LongURL": String,
    "_id": String,
    "ReqSource": String,
    "CreatedOn": String
};
// create model if not exists.
module.exports = mongoose.model('URLCollection', urlSchema);