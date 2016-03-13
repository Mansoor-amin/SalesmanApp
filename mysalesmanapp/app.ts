
import express = require("express");
import path = require("path");
import bodyParser = require("body-parser");
import mongoose = require("mongoose");
import cors = require("cors");


let app = express();
app.use(cors());

var GeneralRoutes = require("./routes/general");
app.set("port", 8000);

app.use(bodyParser.json());

let staticDIR = path.resolve(__dirname,"./static");
app.use(express.static(staticDIR));

app.use(GeneralRoutes);
//GeneralRouts();
app.get("*",  (req:express.Request, res :express.Response)=>{
       let indexViewPath = path.resolve(__dirname,"./static/adminPortal/index.html");
       res.sendFile(indexViewPath);
    });

    
app.listen(app.get("port"), ()=>{
    console.log("server started on port 8000")
});

mongoose.connect("mongodb://salesman:salesman@ds061325.mongolab.com:61325/mysalesmanapp");