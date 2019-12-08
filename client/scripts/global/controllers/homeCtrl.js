app.controller("homeCtrl",function($scope,$window,fetchProdFact,cartAddFact){
    fetchProdFact.fetchHome().then((data)=>{
        $scope.products=data.products;
    },(err)=>{
        $scope.products=[];
    });
    $scope.addToCart=(productid)=>{
        var req={token:localStorage.Shop384, productid:productid};
        cartAddFact.addToCart(req).then((data)=>{
            $scope.resp=data.message;
        },(err)=>{
            if(err.promptlogin)$window.location.href="#/login";
            else $scope.resp=err.message;
        });
    }
});