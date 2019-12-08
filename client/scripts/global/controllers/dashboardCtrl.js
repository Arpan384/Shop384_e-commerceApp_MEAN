app.controller("dashboardCtrl",function($scope,$rootScope,userUpDelFact,$window,loginFact){
    $scope.upd=false;
    $scope.del=false;
    $scope.prod=false;
    $scope.adm=false;
    $scope.home=false;

    if(!localStorage.Shop384)$window.location.href="#/";
    loginFact.fetch({token:localStorage.Shop384}).then((data)=>{
    },(err)=>{
        $rootScope.logOut();
        $window.location.href="#/";
    });

    $scope.update=()=>{
        if($scope.Uupdate.$invalid)return;
        if(!$scope.email&&!$scope.password){return;}
        userUpDelFact.updateUser(localStorage.Shop384,$scope.email,$scope.password).then((data)=>{
            document.querySelector("#resp").classList.remove("hide");
            $scope.resp="User updated successfully";
            setTimeout(() => {
                document.querySelector("#resp").classList.add("hide");
            }, 5000);
        },(err)=>{
            if(err.promptlogin){
                document.querySelector("#resp").classList.remove("hide");
                $scope.resp="Illegal action, please login!";
                $rootScope.logOut();
                setTimeout(()=>{
                    $window.location.href="#/login"
                },5000)
            }
            else {
                document.querySelector("#resp").classList.remove("hide");
                $scope.resp="Can't update due to some error";
                setTimeout(() => {console.log("callrel");
                    document.querySelector("#resp").classList.add("hide");
                }, 5000);
            }
        })
    }
    $scope.delete=()=>{
        userUpDelFact.deleteUser(localStorage.Shop384).then((data)=>{
            document.querySelector("#resp").classList.remove("hide");
            $scope.resp="User deleted successfully";
            $rootScope.logOut();
            setTimeout(()=>{
                $window.location.href="#/home"
            },5000)
        },(err)=>{document.querySelector("#resp").classList.remove("hide");
            if(err.promptlogin){
                $scope.resp="Illegal action, please login!";
                $rootScope.logOut();
                setTimeout(()=>{
                    $window.location.href="#/login"
                },5000)
            }
            else if(!err.delete){
                $scope.resp="You still have pending orders, can't delete account!";
            }
            else $scope.resp="Can't delete due to some error";
        })
        if($scope.resp){
            setTimeout(() => {
                document.querySelector("#resp").classList.add("hide");
        }, 5000);}
    }
    $scope.updtgl=()=>{
        $scope.upd=!$scope.upd;
    }
    $scope.deltgl=()=>{
        document.querySelector("#del").classList.remove("hide");
        if($scope.del){$scope.delete()}
        else $scope.del=true;
        setTimeout(() => {
            document.querySelector("#del").classList.add("hide");
            $scope.del=false;
        }, 5000);
    }
    $scope.prodtgl=()=>{
        $scope.prod=!$scope.prod;
    }
    $scope.admtgl=()=>{
        $scope.adm=!$scope.adm;
    }
    $scope.hometgl=()=>{
        $scope.home=!$scope.home;
    }
    $scope.updhome=()=>{
        $window.location.href="#/products";
    }
    $scope.updcart=()=>{
        $window.location.href="#/inventory";
    }
    $scope.updodr=()=>{
        $window.location.href="#/orders";
    }

    $scope.regAdmin=()=>{
        var user={username:$scope.username, password:$scope.password, email:$scope.email, role:"admin"}
        //console.log(user);
        loginFact.regAdmin({token:localStorage.Shop384, user}).then((data)=>{
            document.querySelector("#resp").classList.remove("hide");
            $scope.resp="Admin registration successful";
            setTimeout(() => {
                $scope.resp="";
                document.querySelector("#resp").classList.add("hide");
            }, 4000);
        },(err)=>{
            if(err.userconflict)$scope.resp="Username already occupied";
            else $scope.resp="Account could not be created due to some error";
            setTimeout(() => {
                $scope.resp="";
                document.querySelector("#resp").classList.add("hide");
            }, 4000);
        });
    }
    // $scope.logOut=()=>{
    //     $rootScope.logOut();
    //     $window.location.href="#/";
    // }

    console.log($rootScope.loggedInC,$rootScope.loggedInS,$rootScope.loggedInA,$rootScope.loggedInM)
});