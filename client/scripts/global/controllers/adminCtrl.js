app.controller("adminCtrl",function($scope,$rootScope,adminOpsFact,$window){
    $scope.deleteP=()=>{
        var req={token:localStorage.Shop384,product:{productid:$scope.prodid}}
        adminOpsFact.delProd(req).then((data)=>{
            $scope.res=data.message;
            $scope.prodid="";
            setTimeout(()=>{
                document.querySelector("#res1").classList.add("hide");
                $scope.res="";
            }, 4000 )
        },(err)=>{
            if(err.promptlogin){
                $scope.res="Illegal action, please login!";
                $rootScope.logOut();
                setTimeout(()=>{
                    $window.location.href="#/login"
                },5000)
            }
            else {
                $scope.res="Can't delete product due to some error";
            }
            $scope.prodid="";
        })
    }

    $scope.addOne=()=>{
        var productid,sellerid,name,quantity,price,description,deliverycharges,picurl;
        if($scope.productid)productid=$scope.productid
        if($scope.sellerid)sellerid=$scope.sellerid
        if($scope.name)name=$scope.name
        if($scope.quantity)quantity=$scope.quantity
        if($scope.price)price=$scope.price
        if($scope.description)description=$scope.description
        if($scope.deliverycharges)deliverycharges=$scope.deliverycharges
        if($scope.picurl)picurl=$scope.picurl

        var req={token:localStorage.Shop384,product:{productid, sellerid, name, quantity, price, description, deliverycharges, picurl}};
        for(let key in req.product){
            if(req.product[key]==undefined)delete req.product[key];
        }
        adminOpsFact.addOne(req).then((data)=>{
            $scope.res=data.message;
            document.querySelector("#res1").classList.remove("hide");
            clear();
            setTimeout(() => {
                document.querySelector("#res1").classList.add("hide");
                $scope.res="";
            }, 4000);
        },(err)=>{
            document.querySelector("#res1").classList.remove("hide");
            if(err.productconflict)$scope.res="Product already exists";
            else if(err.missingrequiredfield)$scope.res="Product already exists";
            else if(err.promptlogin){
                $scope.res="Illegal action, please login!";
                $rootScope.logOut();
                setTimeout(()=>{
                    $window.location.href="#/login"
                },5000)
            }
            else $scope.res="Product cannot be added due to some error";
            setTimeout(() => {
                document.querySelector("#res1").classList.add("hide");
                $scope.res="";
            }, 4000);
        });
    }

    function clear(){
        $scope.productid="";
        $scope.sellerid="";
        $scope.name="";
        $scope.quantity="";
        $scope.price="";
        $scope.description="";
        $scope.deliverycharges="";
        $scope.picurl="";
    }
    $scope.submit = function() {
        if ($scope.upmany.file.$valid && $scope.file) {
          adminOpsFact.addMany($scope.file).then((data)=>{
              console.log(data);
              $scope.res=data.message;
              alert(5);
          },(err)=>{
            $scope.res=err.message;
            console.log(err);
            alert("6");
          });
        }
    };

    // $scope.submit = function(){
    //     var fd = new FormData();
    //     var files = document.getElementById('file').files[0];
    //     fd.append('file',files);
    //     adminOpsFact.test(fd).then((data)=>{
    //         console.log(data);
    //     },(err)=>{
    //         console.log(err);
    //     });
    // }
})