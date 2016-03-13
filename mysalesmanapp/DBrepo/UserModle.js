var mongoose = require("mongoose");
var q = require("q");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    Name: String,
    FatherName: String,
    PhoneNo: Number,
    Email: { type: String, unique: true, required: true },
    Password: String,
    CompanyName: String,
    CreatedOn: { type: Date, defalt: Date.now() },
    FirebaseToken: String
});
var userModle = mongoose.model("users", UserSchema);
function saveUser(userProps) {
    var deferred = q.defer();
    var user = new userModle(userProps);
    user.save(function (err, data) {
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
exports.saveUser = saveUser;
function findUser(query) {
    var deferred = q.defer();
    userModle
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
exports.findUser = findUser;
function updateUser(conditions, update, options) {
    var deferred = q.defer();
    userModle.update(conditions, update, options, function (err) {
        if (err) {
            console.log("error in finding User");
            console.log(err);
            deferred.reject("Error in updating data");
        }
    });
    return deferred.promise;
}
exports.updateUser = updateUser;
