import mongoose = require("mongoose");
import q = require("q");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    Name   : String,
    FatherName   : String,
    PhoneNo   : Number,
    Email   : {type: String, unique : true, required : true},
    Password   : String,
    CompanyName   : String,
    CreatedOn   : {type: Date, defalt : Date.now()},
    FirebaseToken: String
});

let userModle = mongoose.model("users", UserSchema);




function saveUser(userProps){
    let deferred = q.defer();
    let user = new userModle(userProps);
    
    user.save((err, data)=>{
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

function findUser(query){
    let deferred = q.defer();
    
    userModle
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


function updateUser(conditions,update,options){
    let deferred = q.defer();

    userModle.update(conditions, update, options , function(err){
        if(err){
            console.log("error in finding User");
            console.log(err);
            deferred.reject( "Error in updating data");
        }
    });
    return deferred.promise;
}

export {saveUser, findUser, updateUser};