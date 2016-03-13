var app = angular.module("starter");
var  ref = new Firebase("https://salesmans.firebaseio.com/");

app.constant('FirebaseURL',"https://salesmans.firebaseio.com/");

app.controller('LoginCtrl', function($scope,$http, $state) {
    $scope.user = {};
    $scope.LoginUser = function(){
        $http.post("/login", {data : $scope.user})
            .success(function(response){
                if(response.token){
                    console.log(response);
                    localStorage.setItem('token', response.token);
                    $scope.user = {};
                    $state.go("home");
                }
            })
            .error(function(err){
                console.log(err);
            });
    };

});
app.controller('SignupCtrl', function($scope, $http, $state) {
    $scope.user = {};
    $scope.SignUp = function(eve) {
        $http.post("/signup", {data: $scope.user})
            .success(function(response){
                console.log(response);
                $state.go("login")
            })
            .error(function(err){
                console.log(err)
            });
    };

});

app.controller('HomeCtrl', function($scope, $http, $state, $stateParams) {

    $scope.logic;
    $http.get("/get-user")
        .success(function(response){
            $scope.user = response.data;

            $scope.logic = $scope.user.CompanyName;

            $http.get("/get-company")
                .success(function(response){
                    $scope.company = response.data;
                })
                .error(function(){
                    console.log('Error in finding Company');
                });
        })
        .error(function(){
            console.log('Error in finding User');
        });

    $scope.LogOut = function() {
        localStorage.removeItem("token");
        $state.go("login");
    };

    $scope.getLocation = function() {
        alert("Not Available")
    };

});

app.controller('createCompanyCtrl', function($scope, $http, $state) {
    $scope.company = {};
    $scope.company.FirebaseToken = localStorage.getItem("token");
    $scope.CreateCompany = function(){

        $http.post("/create-company", {data : $scope.company})
            .success(function(response){
                console.log(response.status);
                $state.go("home");
            })
            .error(function(err){
                console.log(err);
            });
    };
});
app.controller('modifyCompanyCtrl', function($scope, $http, $state) {
    $scope.company = {};
    $scope.company.FirebaseToken = localStorage.getItem("token");
    $scope.CreateCompany = function(){

        $http.post("/create-company", {data : $scope.company})
            .success(function(response){
                console.log(response.status);
                $state.go("home");
            })
            .error(function(err){
                console.log(err);
            });
    };
});

app.controller('createSalesmanCtrl', function($scope, $http, $state) {
    $scope.user = {};

    $scope.SignUp = function(eve) {
        $http.post("/createSalesman", {data: $scope.user})
            .success(function(response){
                console.log(response.status);
                $state.go("home")
            })
            .error(function(err){
                console.log(err)
            });
    };
});

app.controller('viewOrdersCtrl', function($scope, $http, FirebaseURL, $firebaseArray) {

    $http.get("/get-user")
        .success(function(response){
            $scope.user = response.data;

            $scope.localToken = $scope.user.CompanyName;

            var ref = new Firebase(FirebaseURL).child("/orders");
            var syncedArr = $firebaseArray(ref);
            $scope.orders = syncedArr;
        })
        .error(function(){
            console.log('Error in finding User');
        });

    $scope.remove = function(data){
            console.log(data);
        $http.post("/updateCompany", {order : data})
            .success(function(response){
                console.log(response.status);
                $scope.orders.$remove(data, function(err){
                    if(err){
                        console.log(err);
                    }
                })
            })
            .error(function(err){
                console.log(err);
            });


    }
});

app.controller('addProductsCtrl', function($scope, $http, $state) {
    $scope.product = {};

    $scope.addProduct = function(eve) {
        $http.post("/addProducts", {data: $scope.product})
            .success(function(response){
                console.log(response.status);
                $state.go("home")
            })
            .error(function(err){
                console.log(err)
            });
    };
});

app.controller('viewLocationCtrl', function($scope, $ionicLoading, $compile ,$stateParams) {

    
        var lat = $stateParams.lat;
        var long = $stateParams.long;

        function initialize() {

            var mapProp = {
                center: new google.maps.LatLng(lat, long),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

            //Marker + infowindow + angularjs compiled ng-click

            var marker = new google.maps.Marker({
                position: mapProp.center,
                map: map
            });
        }
       initialize()
           
       // google.maps.event.addDomListener(window, 'load', initialize);


       

});