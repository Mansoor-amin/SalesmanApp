import mongoose = require("mongoose");
import q = require("q");

let Schema = mongoose.Schema;

let CompanySchema = new Schema({
    Name   : {type: String, unique : true, required: true},
    PhoneNo   : Number,
    Email   : {type: String, unique : true, required : true},
    Description   : String,
    SalesMans   : Array,
    Admin   : Object,
    CreatedOn   : {type: Date, defalt : Date.now()},
    Products: Array,
    Orders: Array
});

let companyModle = mongoose.model("companies", CompanySchema);




function CreateCompany(userProps){
    let deferred = q.defer();
    let company = new companyModle(userProps);

    company.save((err, data)=>{
        if(err){
            console.log("Error in saving Company");
            console.log(err);
        deferred.reject("error occurred while saving Company");
        }
        else{
            console.log("Company Saved Successfully");
            deferred.resolve(data);
        }
    });
    
    
    
    return deferred.promise;
    
}

function findCompany(query){
    let deferred = q.defer();

    companyModle
    .findOne(query,function(err, record){
        if(err){
            console.log("error in finding Company");
            console.log(err);
            deferred.reject( "Error in finding Company");
        }else{
            deferred.resolve(record)
        }
    });
     return deferred.promise;
}

function updateCompany(conditions,update,options){
    let deferred = q.defer();

    companyModle.update(conditions, update, options , function(err){
        if(err){
            console.log("error in updating Company");
            console.log(err);
            deferred.reject( "Error in updating Company");
        }
    });
    return deferred.promise;
}
export {CreateCompany, findCompany, updateCompany};