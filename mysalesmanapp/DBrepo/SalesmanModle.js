var mongoose = require("mongoose");
var q = require("q");
var Schema = mongoose.Schema;
var SalesmanSchema = new Schema({
    Name: String,
    FatherName: String,
    PhoneNo: { type: Number, unique: true, required: true },
    Email: { type: String, unique: true, required: true },
    Password: String,
    CompanyName: { type: String, required: true },
    CreatedOn: { type: Date, defalt: Date.now() },
    FirebaseToken: { type: String, unique: true, required: true }
});
var salesmanModle = mongoose.model("salesman", SalesmanSchema);
function saveSalesman(userProps) {
    var deferred = q.defer();
    var salesMan = new salesmanModle(userProps);
    salesMan.save(function (err, data) {
        if (err) {
            console.log("Error in saving user");
            console.log(err);
            deferred.reject("error occurred while saving user");
        }
        else {
            console.log("User Saved Successfully");
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}
exports.saveSalesman = saveSalesman;
function findSalesman(query) {
    var deferred = q.defer();
    salesmanModle
        .findOne(query, function (err, record) {
        if (err) {
            console.log("error in finding User");
            console.log(err);
            deferred.reject("Error in finding user");
        }
        else {
            deferred.resolve(record);
        }
    });
    return deferred.promise;
}
exports.findSalesman = findSalesman;
function updateSalesman(conditions, update, options) {
    var deferred = q.defer();
    salesmanModle
        .update(conditions, update, options, function (err) {
        if (err) {
            console.log("error in finding User");
            console.log(err);
            deferred.reject("Error in updating data");
        }
    });
    return deferred.promise;
}
exports.updateSalesman = updateSalesman;
