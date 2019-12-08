app.controller("orderCtrl",function($scope,$window,$rootScope,orderOpsFact){
    function fetchOrder() {
        orderOpsFact.fetch({token: localStorage.Shop384}).then((data)=>{
            $scope.orders=data.orders;
        },(err)=>{
            if(err.promptlogin){
                setTimeout(() => {
                    $window.location.href="#/login";
                }, 3000);
            }
            $scope.resp=err.message;
            $scope.response=true;
            hide();
        })
    }

    if($rootScope.loggedInC || $rootScope.loggedInS){
        fetchOrder()
    }
    else{
        $window.location.href="#/404"
    }

    function hide(){
        setTimeout(()=>{
            $scope.resp="";
            $scope.response=false;
        },2000)
    }

    $scope.response=true;
    $scope.delOrder=(orderid)=>{
        var req={token:localStorage.Shop384, orderid:orderid};
        console.log(req);
        orderOpsFact.cancel(req).then((data)=>{
            $scope.resp=data.message; fetchOrder()
            hide()
        },(err)=>{
            $scope.resp=err.message;
            $scope.response=true;
            hide();
        });
    }

    $scope.updOrder=(orderid,status)=>{
        var req={token:localStorage.Shop384, order:{orderid:orderid, status:status}};
        console.log(req);
        orderOpsFact.update(req).then((data)=>{
            $scope.resp=data.message; fetchOrder()
            hide()
        },(err)=>{
            $scope.resp=err.message;
            $scope.response=true;
            hide();
        });
    }
})