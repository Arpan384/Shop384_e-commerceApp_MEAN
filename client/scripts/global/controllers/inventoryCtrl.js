app.controller("cartCtrl",function($scope,$rootScope,$window,cartOpsFact){
    function fetch(){
        cartOpsFact.fetchCart({token:localStorage.Shop384}).then((data)=>{
        $scope.cartitems=data.cartitems;
        },(err)=>{
            if(err.promptlogin){
                setTimeout(() => {
                    $window.location.href="#/login";
                }, 3000);
            }
            $scope.resp=err.message;
            $scope.response=true;
            hide();
        });
    }
    if($rootScope.loggedInC){
        fetch()
    }
    else{
        $window.location.href="#/404"   //to be constructed
    }
    $scope.response=true;
    $scope.delCart=(productid)=>{
        var req={token:localStorage.Shop384, productid:productid};
        console.log(req);
        cartOpsFact.delCart(req).then((data)=>{
            $scope.resp=data.message; fetch()
            hide()
        },(err)=>{
            $scope.resp=err.message;
            $scope.response=true;
            hide();
        });
    }
    function hide(){
        setTimeout(()=>{
            $scope.resp="";
            $scope.response=false;
        },2000)
    }
});