app.controller("loginCtrl",function($scope,$rootScope,loginFact,$window){
    //console.log("loaded");
    $scope.reg=false;
    $scope.logIn=()=>{console.log("call1");
        if($scope.username&&$scope.password){    
            let user={username:$scope.username, password:$scope.password, email:$scope.email}
            console.log(user);
            loginFact.login({user}).then((data)=>{console.log(data);
                localStorage.Shop384=data.token;
                $rootScope.userIn=data.username;
                $rootScope.loggedIn=true;
                if(data.profile.role=="consumer"){
                    $rootScope.loggedInC=true;
                    $window.location.href="#/home";
                }
                else if(data.profile.role=="seller"){
                    $rootScope.loggedInS=true;
                    $window.location.href="#/dashboard";
                }
                else if(data.profile.role=="admin"){
                    $rootScope.loggedInA=true;
                    $window.location.href="#/dashboard";
                }
                else if(data.profile.role=="master"){
                    $rootScope.loggedInM=true;
                    $window.location.href="#/dashboard";
                }
            },(err)=>{
                if(err.invalid)$scope.resp="Invalid username or password"
            });
        }
        else $scope.resp="Please check the fields and retry";
    };
    $scope.register=()=>{
        var user={username:$scope.username, password:$scope.password, email:$scope.email, role:$scope.role}
        console.log(user);
        loginFact.register(user).then((data)=>{console.log(data)
            $scope.resp="Registration successful, please check your email to get started    [Redirecting you to Home]";
            setTimeout(()=>{
                $window.location.href="#/home";
                },5000
            );
        },(err)=>{
            if(err.userconflict)$scope.resp="Username already occupied";
            else $scope.resp="Account could not be created due to some error";
        });
    }
    $scope.log=()=>{ console.log("call")
        if($scope.reg)$scope.reg=false;
        else if($scope.Log.$invalid)return;
        else $scope.logIn();
    }
    $scope.regist=()=>{ console.log("call")
        if(!$scope.reg)$scope.reg=true;
        else if($scope.Reg.$invalid)return;
        else $scope.register();
    }
});