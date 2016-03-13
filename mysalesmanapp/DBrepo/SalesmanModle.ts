import mongoose = require("mongoose");
import q = require("q");

let Schema = mongoose.Schema;

let SalesmanSchema = new Schema({
    Name   : String,
    FatherName   : String,
    PhoneNo   : {type: Number, unique : true, required : true},
    Email   : {type: String, unique : true, required : true},
    Password   : String,
    CompanyName   : {type: String,required : true},
    CreatedOn   : {type: Date, defalt : Date.now()},
    FirebaseToken   : {type: String, unique : true, required : true}
});

let salesmanModle = mongoose.model("salesman", SalesmanSchema);




function saveSalesman(userProps){
    let deferred = q.defer();
    let salesMan = new salesmanModle(userProps);

    salesMan.save((err, data)=>{
        if(err){
            console.log("Error in saving user");
            console.log(err);
        deferred.reject("error occurred while saving user");
        }
        else{
            console.log("User Saved Successfully");
            deferred.resolve(data);
        }
    });
    
    
    
    return deferred.promise;
    
}

function findSalesman(query){
    let deferred = q.defer();

    salesmanModle
    .findOne(query,function(err, record){
        if(err){
            console.log("error in finding User");
            console.log(err);
            deferred.reject( "Error in finding user");
        }else{
            deferred.resolve(record)
        }
    });
     return deferred.promise;
}


function updateSalesman(conditions,update,options){
    let deferred = q.defer();

    salesmanModle
        .update(conditions, update, options , function(err){
        if(err){
            console.log("error in finding User");
            console.log(err);
            deferred.reject( "Error in updating data");
        }
    });
    return deferred.promise;
}

export {saveSalesman, findSalesman, updateSalesman};