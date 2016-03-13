var app = angular.module("starter");
var  ref = new Firebase("https://salesmans.firebaseio.com/");

app.constant('FirebaseURL',"https://salesmans.firebaseio.com/");

app.controller('LoginCtrl', function($scope,$http, $state) {
    $scope.user = {};
    $scope.LoginUser = function(){
        $http.post("http://localhost:8000/loginSalesman", {data : $scope.user})
            .success(function(response){
            console.log(response);
            if(response.token){
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

app.controller('HomeCtrl', function($scope, $http, $state) {

      $http.get("http://localhost:8000/get-company-salesman")
        .success(function(response){
          $scope.company = response.data;
        })
        .error(function(){
          console.log('Error in finding Company');
        });


  $scope.LogOut = function() {
    localStorage.removeItem("token");
    $state.go("login");
  };

  $scope.getLocation = function() {
    alert("Not Available")
  };

});

app.controller('createOrderCtrl', function($scope, $http, $state, $cordovaGeolocation) {
    $scope.order = {};

    $scope.createOrder = function(){

      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;
          $scope.order.location = {"lat": lat, "long": long};

          $http.post("http://localhost:8000/createOrder", {data : $scope.order})
            .success(function(response){
              console.log(response);
              $state.go("home");
            })
            .error(function(err){
              console.log(err);
            });

        }, function(err) {
            console.log(err)
        });
    };
});

app.controller('viewOrdersCtrl', function($scope, $http, $state, FirebaseURL, $firebaseArray) {
      var ref = new Firebase(FirebaseURL).child("/orders");
      var syncedArr = $firebaseArray(ref);
      $scope.orders = syncedArr;
      $scope.localToken = localStorage.getItem("token");
      console.log($scope.orders);
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

});
