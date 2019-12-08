app.controller("masterCtrl",function($scope,$rootScope,masterOpsFact,$window){
    function getAdms(){
        masterOpsFact.fetchAdms().then((data)=>{
            console.log(data)
            $scope.admins=data.admins;
        },(err)=>{
            console.log(err);
            $scope.res="Error in admins fetch";
            clear();
        });
    }
    getAdms();
    $scope.delAdm=(username)=>{
        var req={token:localStorage.Shop384,user:{username:username}};
        masterOpsFact.delAdm(req).then((data)=>{
            document.querySelector("#res2").classList.remove("hide");
            $scope.res=data.message;
            getAdms()
            clear();
        },(err)=>{
            document.querySelector("#res2").classList.remove("hide");
            if(err.promptlogin){
                $scope.res="Illegal action, please login!";
                $rootScope.logOut();
                setTimeout(()=>{
                    $window.location.href="#/login"
                },5000)
            }
            else $scope.res="Error in admins fetch";
            clear();
            getAdms();
        })
    }
    function clear(){
        setTimeout(()=>{
            document.querySelector("#res2").classList.add("hide");
            $scope.res="";
        }, 4000 )
    }
    $scope.regAdmin=()=>{
        let req={token:localStorage.Shop384, user:{ username:$scope.username ,password:$scope.password , email:$scope.email}}
        masterOpsFact.regAdmin(req).then((data)=>{
            document.querySelector("#res2").classList.remove("hide");
            $scope.res="Admin Added";
            getAdms();
            clear()
        },(err)=>{
            document.querySelector("#res2").classList.remove("hide");
            if(err.userconflict)$scope.res="Username already occupied";
            else if(err.promptlogin){
                $scope.res="Illegal action";
                setTimeout(()=>{
                    $window.location.href="#/login";
                },3000)
            }
            else $scope.res="Error in admin creation";
            clear();
        })
    }
})