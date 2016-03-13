
var app = angular.module('starter', ['ionic', 'firebase']);

app.config(function($stateProvider,$urlRouterProvider, $httpProvider){
  $stateProvider
    .state("login", {
        url: "/login",
        templateUrl : "adminPortal/templates/login.html",
        controller: 'LoginCtrl'
    })
    .state("signup", {
        url: "/signup",
        templateUrl : "adminPortal/templates/signup.html",
        controller: 'SignupCtrl'
    })
    .state("home", {
        url: "/home",
        templateUrl : "adminPortal/templates/home.html",
        controller: 'HomeCtrl',
          loginCompulsory :true
    })
    .state("createCompany", {
        url: "/createCompany",
        templateUrl : "adminPortal/templates/createCompany.html",
        controller: 'createCompanyCtrl',
          loginCompulsory :true
    })
    .state("createSalesman", {
        url: "/createSalesman",
        templateUrl : "adminPortal/templates/createSalesman.html",
        controller: 'createSalesmanCtrl',
          loginCompulsory :true
    })
    .state("viewOrders", {
        url: "/viewOrders",
        templateUrl : "adminPortal/templates/viewOrders.html",
        controller: 'viewOrdersCtrl',
          loginCompulsory :true
    })
    .state("modifyCompany", {
        url: "/modifyCompany",
        templateUrl : "adminPortal/templates/modifyCompany.html",
        controller: 'modifyCompanyCtrl',
          loginCompulsory :true
    })
    .state("addProducts", {
        url: "/addProducts",
        templateUrl : "adminPortal/templates/addProducts.html",
        controller: 'addProductsCtrl',
          loginCompulsory :true
    })
    .state("viewLocation", {
          url: "/viewLocation/:lat/:long",
          templateUrl : "adminPortal/templates/viewLocation.html",
          controller: 'viewLocationCtrl',
          loginCompulsory :true
      });

    $urlRouterProvider.otherwise("/home");

    $httpProvider.interceptors.push("httpInterceptor")
});

app.run(function($rootScope, $state){
    $rootScope.$on("$stateChangeStart", function(event, toState){
        var firebaseLocalToken = localStorage.getItem("token");

        if(toState.loginCompulsory && !firebaseLocalToken){
            event.preventDefault();
            $state.go("login");
        }

    });

});

app.factory("httpInterceptor", function(){
    return{
        request : function(config){
            var token = localStorage.getItem("token");
            if(token){
                config.url = config.url + "?token=" + token;
            }
            return config;
        }
    }
});