
var app = angular.module('starter', ['ionic', 'firebase', 'ngCordova']);

app.config(function($stateProvider,$urlRouterProvider, $httpProvider){
  $stateProvider
    .state("login", {
        url: "/login",
        templateUrl : "templates/login.html",
        controller: 'LoginCtrl'
    })
    .state("home", {
        url: "/home",
        templateUrl : "templates/home.html",
        controller: 'HomeCtrl',
          loginCompulsory :true
    })
    .state("createOrder", {
        url: "/createOrder",
        templateUrl : "templates/createOrder.html",
        controller: 'createOrderCtrl',
          loginCompulsory :true
    })
    .state("viewOrders", {
        url: "/viewOrders",
        templateUrl : "templates/viewOrders.html",
        controller: 'viewOrdersCtrl',
          loginCompulsory :true
    })
    .state("viewLocation", {
        url: "/viewLocation/:lat/:long",
        templateUrl : "templates/viewLocation.html",
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
