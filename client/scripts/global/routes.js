app.config(function($routeProvider,$locationProvider){
    $locationProvider.hashPrefix("");
    $routeProvider.when("/",{
        templateUrl:"./views/home.html",
        //controller:"homeCtrl"
    }).when("/login",{
        templateUrl:"./views/login.html",
        controller:"loginCtrl"
    }).when("/dashboard",{
        templateUrl:"./views/dashboard.html",
        controller:"dashboardCtrl"
    }).when('/products',{
        templateUrl:"views/allProd.html",
        controller:"allProdCtrl"
    }).when('/orders',{
        templateUrl:"views/order.html",
        controller:"orderCtrl"
    }).when('/inventory',{
        templateUrl:"views/inventory.html",
        controller:"cartCtrl"
    }).when('/solo/:productid',{
        templateUrl:"views/solo.html",
        controller:"soloCtrl"
    }).otherwise({
        redirectTo:"/"
    });
});