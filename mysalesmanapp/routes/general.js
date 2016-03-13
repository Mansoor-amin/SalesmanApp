var express = require("express");
var Firebase = require("firebase");
var ref = new Firebase("https://salesmans.firebaseio.com/");
var refUsers = ref.child("users");
var refOrders = ref.child("orders");
var newPostRef;
var UserModle_1 = require("../DBrepo/UserModle");
var CompanyModle_1 = require("../DBrepo/CompanyModle");
var SalesmanModle_1 = require("../DBrepo/SalesmanModle");
var router = express.Router();
router.post("/signup", function (req, res) {
    refUsers.createUser({
        email: req.body.data.Email,
        password: req.body.data.Password
    }, function (err, success) {
        if (err) {
            res.send(err);
        }
        else {
            req.body.data.FirebaseToken = success.uid;
            UserModle_1.saveUser(req.body.data)
                .then(function (userInstaance) {
                res.send({ status: true, user: userInstaance });
            }, function (err) {
                refUsers.removeUser({
                    email: req.body.data.Email,
                    password: req.body.data.Password
                }, function (err) {
                    if (err) {
                        console.log("Failed to delete account.");
                    }
                    else {
                        console.log("Successfully account deleted.");
                    }
                });
                res.send({ status: false, message: err });
            });
        }
    });
});
router.post("/login", function (req, res) {
    var user = req.body.data;
    UserModle_1.findUser({ Email: user.email })
        .then(function (userInstance) {
        if (!userInstance) {
            res.send("No user found with supplied email");
            return;
        }
        if (userInstance.Password == user.password) {
            res.send({ message: "Logged In Successfull", token: userInstance.FirebaseToken });
        }
        else {
            res.send("Wrong Password");
        }
    }, function (err) {
        console.log(err);
        res.send({ status: false, message: err });
    });
});
router.post("/loginSalesman", function (req, res) {
    var user = req.body.data;
    SalesmanModle_1.findSalesman({ Email: user.email })
        .then(function (userInstance) {
        if (!userInstance) {
            console.log(userInstance);
            res.send({ status: false, message: "No user found with supplied email" });
            return;
        }
        if (userInstance.Password == user.password) {
            res.send({ message: "Logged In Successfull", token: userInstance.FirebaseToken });
        }
        else {
            res.send("Wrong Password");
        }
    }, function (err) {
        console.log(err);
        res.send({ status: false, message: err });
    });
});
router.post("/create-company", function (req, res) {
    var user = req.body.data;
    var Admin = {};
    UserModle_1.findUser({ FirebaseToken: req.query.token })
        .then(function (userInstance) {
        if (userInstance.FirebaseToken === user.FirebaseToken) {
            Admin = {
                Name: userInstance.Name,
                PhoneNo: userInstance.PhoneNo,
                Email: userInstance.Email,
                FirebaseToken: userInstance.FirebaseToken
            };
            var data = {
                Name: req.body.data.Name,
                PhoneNo: req.body.data.PhoneNo,
                Email: req.body.data.Email,
                Description: req.body.data.Description,
                Admin: Admin,
                CreatedOn: new Date().toLocaleString()
            };
            CompanyModle_1.CreateCompany(data)
                .then(function (companyInstaance) {
                UserModle_1.updateUser({ FirebaseToken: req.query.token }, { $set: { CompanyName: companyInstaance.Name } }, { multi: false })
                    .then(function (err) {
                    console.log("error in updating user." + err);
                });
                res.send({ status: true, company: companyInstaance });
            }, function (err) {
                console.log(err);
                res.send({ status: false, message: err });
            });
        }
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.post("/updateCompany", function (req, res) {
    var order = req.body.order;
    var user;
    UserModle_1.findUser({ FirebaseToken: req.query.token })
        .then(function (data) {
        user = data;
        CompanyModle_1.findCompany({ Name: user.CompanyName })
            .then(function (data) {
            data.Orders.push(order);
            CompanyModle_1.updateCompany({ Name: data.Name }, { $set: { Orders: data.Orders } }, { multi: false })
                .then(function (data) {
                res.send({ status: true, data: data, message: "company updated Successfully" });
            }, function (err) {
                console.log("error in updating company." + err);
                res.send({ status: false, data: err });
            });
            res.send({ status: true, data: data });
        }, function (err) {
            console.log(err);
            res.send({ status: false, data: err });
        });
    }, function (err) {
        res.send({ status: false, data: err });
    });
});
router.get("/get-user", function (req, res) {
    var user;
    UserModle_1.findUser({ FirebaseToken: req.query.token })
        .then(function (data) {
        user = data;
        res.send({ status: true, data: user });
    });
});
router.get("/get-company", function (req, res) {
    var company;
    var user;
    UserModle_1.findUser({ FirebaseToken: req.query.token })
        .then(function (data) {
        user = data;
        CompanyModle_1.findCompany({ Name: user.CompanyName })
            .then(function (data) {
            company = data;
            res.send({ status: true, data: company });
        }, function (err) {
            res.send({ status: false, data: err });
        });
    }, function (err) {
        res.send({ status: false, data: err });
    });
});
router.get("/get-company-salesman", function (req, res) {
    var company;
    var user;
    SalesmanModle_1.findSalesman({ FirebaseToken: req.query.token })
        .then(function (data) {
        user = data;
        CompanyModle_1.findCompany({ Name: user.CompanyName })
            .then(function (data) {
            company = data;
            res.send({ status: true, data: company });
        }, function (err) {
            res.send({ status: false, data: err });
        });
    }, function (err) {
        res.send({ status: false, data: err });
    });
});
router.post("/createSalesman", function (req, res) {
    var user;
    refUsers.createUser({
        email: req.body.data.Email,
        password: req.body.data.Password
    }, function (err, success) {
        if (err) {
            res.send(err);
        }
        else {
            req.body.data.FirebaseToken = success.uid;
            var salesman = req.body.data;
            UserModle_1.findUser({ FirebaseToken: req.query.token })
                .then(function (data) {
                user = data;
                salesman.CompanyName = user.CompanyName;
                SalesmanModle_1.saveSalesman(salesman)
                    .then(function (SalesmanInstaance) {
                    CompanyModle_1.findCompany({ Name: user.CompanyName })
                        .then(function (data) {
                        data.SalesMans.push({
                            "Name": salesman.Name,
                            "PhoneNo": salesman.PhoneNo,
                            "Email": salesman.Email
                        });
                        CompanyModle_1.updateCompany({ Name: data.Name }, { $set: { SalesMans: data.SalesMans } }, { multi: false })
                            .then(function (data) {
                        }, function (err) {
                            console.log("error in updating company." + err);
                        });
                    }, function (err) {
                        console.log(err);
                    });
                    res.send({ status: true, data: SalesmanInstaance });
                }, function (err) {
                    res.send({ status: false, data: err });
                });
            }, function (err) {
                res.send({ status: false, data: err });
            });
        }
    });
});
router.get("/get-salesmans", function (req, res) {
    var salesmans;
    SalesmanModle_1.findSalesman({ CompanyName: req.body.data })
        .then(function (data) {
        salesmans = data;
        res.send({ status: true, data: salesmans });
    }, function (err) {
        res.send({ status: true, data: err });
    });
});
router.post("/addProducts", function (req, res) {
    var product = req.body.data;
    var user;
    UserModle_1.findUser({ FirebaseToken: req.query.token })
        .then(function (data) {
        user = data;
        CompanyModle_1.findCompany({ Name: user.CompanyName })
            .then(function (data) {
            data.Products.push(product);
            CompanyModle_1.updateCompany({ Name: data.Name }, { $set: { Products: data.Products } }, { multi: false })
                .then(function (data) {
                res.send({ status: true, data: data });
            }, function (err) {
                console.log("error in updating company." + err);
                res.send({ status: false, data: err });
            });
            res.send({ status: true, data: data });
        }, function (err) {
            console.log(err);
            res.send({ status: false, data: err });
        });
    }, function (err) {
        res.send({ status: false, data: err });
    });
});
router.post("/createOrder", function (req, res) {
    var order = req.body.data;
    var user;
    SalesmanModle_1.findSalesman({ FirebaseToken: req.query.token })
        .then(function (data) {
        user = data;
        order.salesman = {
            "Name": user.Name,
            "PhoneNo": user.PhoneNo,
            "FirebaseToken": user.FirebaseToken
        };
        order.CompanyName = data.CompanyName;
        newPostRef = refOrders.push(order, function (err) {
            if (err) {
                res.send({ status: false, message: err });
            }
            else {
                var orderId = newPostRef.key();
                res.send({ status: true, data: data, user: user, message: "order created successfully" });
            }
        });
    }, function (err) {
        res.send({ status: false, data: err });
    });
});
module.exports = router;
