var mongoose = require("mongoose");
var q = require("q");
var Schema = mongoose.Schema;
var CompanySchema = new Schema({
    Name: { type: String, unique: true, required: true },
    PhoneNo: Number,
    Email: { type: String, unique: true, required: true },
    Description: String,
    SalesMans: Array,
    Admin: Object,
    CreatedOn: { type: Date, defalt: Date.now() },
    Products: Array,
    Orders: Array
});
var companyModle = mongoose.model("companies", CompanySchema);
function CreateCompany(userProps) {
    var deferred = q.defer();
    var company = new companyModle(userProps);
    company.save(function (err, data) {
        if (err) {
            console.log("Error in saving Company");
            console.log(err);
            deferred.reject("error occurred while saving Company");
        }
        else {
            console.log("Company Saved Successfully");
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}
exports.CreateCompany = CreateCompany;
function findCompany(query) {
    var deferred = q.defer();
    companyModle
        .findOne(query, function (err, record) {
        if (err) {
            console.log("error in finding Company");
            console.log(err);
            deferred.reject("Error in finding Company");
        }
        else {
            deferred.resolve(record);
        }
    });
    return deferred.promise;
}
exports.findCompany = findCompany;
function updateCompany(conditions, update, options) {
    var deferred = q.defer();
    companyModle.update(conditions, update, options, function (err) {
        if (err) {
            console.log("error in updating Company");
            console.log(err);
            deferred.reject("Error in updating Company");
        }
    });
    return deferred.promise;
}
exports.updateCompany = updateCompany;
