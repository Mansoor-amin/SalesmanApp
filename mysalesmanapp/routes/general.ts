
import express = require("express");
import Firebase = require("firebase");
let ref = new Firebase("https://salesmans.firebaseio.com/");
let refUsers = ref.child("users");
let refOrders = ref.child("orders");
let newPostRef;
import  {saveUser, findUser, updateUser} from "../DBrepo/UserModle";
import  {CreateCompany, findCompany, updateCompany} from "../DBrepo/CompanyModle";
import  {saveSalesman, findSalesman, updateSalesman} from "../DBrepo/SalesmanModle";


let router = express.Router();

router.post("/signup", (req:express.Request, res :express.Response)=>{
    refUsers.createUser({
        email: req.body.data.Email,
        password: req.body.data.Password
    },function(err, success){
        if(err){
            res.send(err);
        }else{
            req.body.data.FirebaseToken = success.uid;
            saveUser(req.body.data)
                .then((userInstaance)=>{
                    res.send({status: true, user: userInstaance});
                },(err)=>{
                    refUsers.removeUser({
                        email: req.body.data.Email,
                        password: req.body.data.Password
                    }, function(err){
                        if(err){
                            console.log("Failed to delete account.")
                        }else{
                            console.log("Successfully account deleted.")
                        }
                    });
                    res.send({status: false, message: err});
                });
        }
    });
});

router.post("/login", (req:express.Request, res :express.Response)=>{
    let user = req.body.data;
    findUser({Email: user.email})
        .then((userInstance)=>{
            if(!userInstance){
                res.send("No user found with supplied email");
                return;
            }

            if(userInstance.Password==user.password){
                res.send({message:"Logged In Successfull", token:userInstance.FirebaseToken});
            } else{
                res.send("Wrong Password");
            }
        },(err)=>{
            console.log(err);
            res.send({status: false, message : err});
        });
});

router.post("/loginSalesman", (req:express.Request, res :express.Response)=>{
    let user = req.body.data;
    findSalesman({Email: user.email})
        .then((userInstance)=>{
            if(!userInstance){
                console.log(userInstance);

                res.send({status:false, message:"No user found with supplied email"});
                return;
            }

            if(userInstance.Password==user.password){
                res.send({message:"Logged In Successfull", token:userInstance.FirebaseToken});
            } else{
                res.send("Wrong Password");
            }
        },(err)=>{
            console.log(err);
            res.send({status: false, message : err});
        });
});


router.post("/create-company", function (req, res) {
    let user = req.body.data;
    let Admin = {};
    findUser({FirebaseToken: req.query.token})
        .then((userInstance)=>{
            if(userInstance.FirebaseToken===user.FirebaseToken){
                Admin = {
                    Name   : userInstance.Name,
                    PhoneNo   : userInstance.PhoneNo,
                    Email   : userInstance.Email,
                    FirebaseToken   :userInstance.FirebaseToken
                };
                let data = {
                    Name   : req.body.data.Name,
                    PhoneNo   : req.body.data.PhoneNo,
                    Email   : req.body.data.Email,
                    Description   : req.body.data.Description,
                    Admin   : Admin,
                    CreatedOn   : new Date().toLocaleString()
                };
                CreateCompany(data)
                    .then((companyInstaance)=>{
                        updateUser({FirebaseToken: req.query.token},{$set: {CompanyName   : companyInstaance.Name}},{ multi: false })
                            .then((err)=>{
                                console.log("error in updating user." + err);
                            });
                        res.send({status: true, company: companyInstaance});
                    },(err)=>{
                        console.log(err);
                        res.send({status: false, message: err});
                    });
            }
    },(err)=>{
            res.send({status: false, message : err});
        });
});

router.post("/updateCompany", (req, res)=>{
    let order = req.body.order;
    let user ;

    findUser({FirebaseToken: req.query.token})
        .then((data)=>{
            user = data;

            findCompany({Name: user.CompanyName})
                .then((data)=>{
                    data.Orders.push(order);
                    updateCompany({Name: data.Name},{$set: {Orders   : data.Orders}},{ multi: false })
                        .then((data)=>{
                            res.send({status: true, data: data ,message: "company updated Successfully"});
                        },(err)=>{
                            console.log("error in updating company." + err);
                            res.send({status: false, data: err});
                        });
                    res.send({status: true, data: data});
                },(err)=>{
                    console.log(err);
                    res.send({status: false, data: err});

                });
        },(err)=>{
            res.send({status: false, data: err});
        });
});

router.get("/get-user", (req, res)=>{
    let user ;
        findUser({FirebaseToken: req.query.token})
            .then((data)=>{
                    user = data;
                res.send({status: true, data: user});

            });
});

router.get("/get-company", (req, res)=>{
    let company;
    let user ;
    findUser({FirebaseToken: req.query.token})
        .then((data)=>{
            user = data;
            findCompany({Name: user.CompanyName})
                .then((data)=>{
                    company = data;
                    res.send({status: true, data: company});

                },(err)=>{
                    res.send({status: false, data: err});
                });
        },(err)=>{
            res.send({status: false, data: err});
        });

});

router.get("/get-company-salesman", (req, res)=>{
    let company;
    let user ;
    findSalesman({FirebaseToken: req.query.token})
        .then((data)=>{
            user = data;
            findCompany({Name: user.CompanyName})
                .then((data)=>{
                    company = data;
                    res.send({status: true, data: company});

                },(err)=>{
                    res.send({status: false, data: err});
                });
        },(err)=>{
            res.send({status: false, data: err});
        });

});

router.post("/createSalesman", (req:express.Request, res :express.Response)=>{
    let user ;

    refUsers.createUser({
        email: req.body.data.Email,
        password: req.body.data.Password
    },function(err, success){
        if(err){
            res.send(err);
        }else{
            req.body.data.FirebaseToken = success.uid;
            let salesman = req.body.data;

            findUser({FirebaseToken: req.query.token})
                .then((data)=>{
                    user = data;
                    salesman.CompanyName = user.CompanyName;
                    saveSalesman(salesman)
                        .then((SalesmanInstaance)=>{
                            findCompany({Name: user.CompanyName})
                                .then((data)=>{
                                    data.SalesMans.push({
                                        "Name": salesman.Name,
                                        "PhoneNo": salesman.PhoneNo,
                                        "Email": salesman.Email
                                    });
                                    updateCompany({Name: data.Name},{$set: {SalesMans   : data.SalesMans}},{ multi: false })
                                        .then((data)=>{

                                        },(err)=>{
                                            console.log("error in updating company." + err);
                                        });
                                },(err)=>{
                                    console.log(err);
                                });
                            res.send({status: true, data: SalesmanInstaance});
                        },(err)=>{
                            res.send({status: false, data: err});
                        })

                },(err)=>{
                    res.send({status: false, data: err});
                });

        }
    });
});

router.get("/get-salesmans", (req, res)=>{
    let salesmans;
    findSalesman({CompanyName: req.body.data})
        .then((data)=>{
            salesmans = data;
            res.send({status: true, data: salesmans});

        },(err)=>{
            res.send({status: true, data: err});
        });
});

router.post("/addProducts", (req:express.Request, res :express.Response)=>{
    let product = req.body.data;
    let user ;
    findUser({FirebaseToken: req.query.token})
        .then((data)=>{
            user = data;

            findCompany({Name: user.CompanyName})
                .then((data)=>{
                    data.Products.push(product);
                    updateCompany({Name: data.Name},{$set: {Products   : data.Products}},{ multi: false })
                        .then((data)=>{
                            res.send({status: true, data: data});
                        },(err)=>{
                            console.log("error in updating company." + err);
                            res.send({status: false, data: err});
                        });
                    res.send({status: true, data: data});
                },(err)=>{
                    console.log(err);
                    res.send({status: false, data: err});

                });
        },(err)=>{
            res.send({status: false, data: err});
        });
});

router.post("/createOrder", (req:express.Request, res :express.Response)=>{
    let order = req.body.data;
    let user ;

    findSalesman({FirebaseToken: req.query.token})
        .then((data)=>{
            user = data;
            order.salesman = {
                "Name": user.Name,
                "PhoneNo" : user.PhoneNo,
                "FirebaseToken" : user.FirebaseToken
            };
            order.CompanyName =data.CompanyName;
            newPostRef = refOrders.push(order,function(err){
                if(err){
                    res.send({status: false, message : err});
                }else{
                    var orderId = newPostRef.key();

                    res.send({status: true, data: data, user : user, message:"order created successfully"});
                }
            });
        },(err)=>{
            res.send({status: false, data: err});
        });
});


module.exports = router;
