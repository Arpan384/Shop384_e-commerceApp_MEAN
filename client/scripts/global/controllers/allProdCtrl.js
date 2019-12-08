app.controller("allProdCtrl",function($scope,$rootScope,$window,fetchProdFact,cartOpsFact){
    if(!$rootScope.loggedIn||$rootScope.loggedInM||$rootScope.loggedInC){
        fetchProdFact.fetchAll().then((data)=>{
            $scope.products=data.products;
        },(err)=>{
            $scope.err=true;
            $scope.products=[];
        });
    }
    $scope.err=false;
    if($rootScope.loggedInS){
        fetchProdFact.fetchSeller({token:localStorage.Shop384}).then((data)=>{
            $scope.products=data.products;
        },(err)=>{
            console.log(err);
            $scope.products=[];
            setTimeout(()=>{
                $window.location.href="#/login"
            },3000)
        });
    }

    $scope.addToCart=(productid)=>{
        var req={token:localStorage.Shop384, productid:productid};
        cartOpsFact.addToCart(req).then((data)=>{
            $scope.resp=data.message;
        },(err)=>{
            if(err.promptlogin)$window.location.href="#/login";
        else $scope.resp=err.message;
        });
    }
});