var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var mongoOp     =   require("./model/mongo");
var shortid     =   require('shortid');
var config      =   require('./config');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});
//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.
router.route("/shorturl")
    .get(function(req,res){
        var response = {};
        mongoOp.find({},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
    .post(function(req,res){
           var db = new mongoOp();

           var response = {};
          mongoOp.find({'LongURL':req.body.LongURL} ,function(err,data){
            console.log(data.length);
            if(err) {
             response = {"error" : true,"message" : "Error fetching data"};
           }
           else if(data.length==0) {
               var locshortid=shortid.generate();
               // fetch email and password from REST request.
               // Add strict validation when you use this in Production.
               db.LongURL = req.body.LongURL;
               db.CreatedOn= new Date();
               // Hash the password using SHA1 algorithm.
               db._id = locshortid;
               db.ReqSource = req.body.ReqSource;
               db.save(function(err){
               // save() will run insert() command of MongoDB.
               // it will add new data in collection.
                   if(err) {
                       response = {"error" : true,"message" : "Error adding data"};
                   } else {
                       response = {"error" : false,"message" : config.webhost + locshortid};
                   }
                   res.json(response);
               });
             }
             else{
                response = {"error" : false,"message" : config.webhost + data[0]._id};
                res.json(response);
             }
           });
       });
       router.route("/:id")
               .get(function(req,res){
                   var response = {};
                   mongoOp.findById(req.params.id,function(err,data){
                   // This will run Mongo Query to fetch data based on ID.
                     if(err) {

                       response = {"error" : true,"message" : "Error"};
                     }
                     else {
                       response = {"error" : true,"message" : data};
                       console.log(response.message.LongURL);
                     }
                     //res.json(response);
                     res.redirect( response.message.LongURL);
                   });
               });
app.use('/',router);

app.listen(3002);
console.log("Listening to PORT 3002");
