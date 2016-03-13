var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");
var app = express();
app.use(cors());
var GeneralRoutes = require("./routes/general");
app.set("port", 8000);
app.use(bodyParser.json());
var staticDIR = path.resolve(__dirname, "./static");
app.use(express.static(staticDIR));
app.use(GeneralRoutes);
//GeneralRouts();
app.get("*", function (req, res) {
    var indexViewPath = path.resolve(__dirname, "./static/adminPortal/index.html");
    res.sendFile(indexViewPath);
});
app.listen(app.get("port"), function () {
    console.log("server started on port 8000");
});
mongoose.connect("mongodb://salesman:salesman@ds061325.mongolab.com:61325/mysalesmanapp");
