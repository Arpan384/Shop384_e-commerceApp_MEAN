app.controller("globalCtrl",($rootScope,$scope,$window,masterFact,loginFact)=>{
    var master=masterFact.fetchMaster();
    master.then((data)=>{
        if(data.promptNewMaster){
            $scope.master=true;
        }
        else {
            $scope.master=false;
            if(localStorage.Shop384){
                loginFact.fetch({token:localStorage.Shop384}).then((data)=>{
                    $rootScope.userIn=data.username;
                    $rootScope.loggedIn=true;
                    console.log("call4",data);
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
                    console.log(err);
                    $rootScope.logOut();
                    $window.location.href="#/"
                });
            }
            else $rootScope.loggedIn=false;
        }
    },(error)=>{
        $scope.masterError=true;
    });
    $scope.genMaster=(email)=>{
        var master=masterFact.genMaster(email);
        master.then((data)=>{
            if(data.success){
                $scope.master=false;
                $scope.masterGen="Master generated, please login within 24 hrs to verify your accout, else it would be dismantled!!";
                $scope.mClass="alert-success";
                setTimeout(()=>{$window.location.href="./index.html"},5000);
            }
        },(error)=>{
            $scope.master=false;
            $scope.masterGen="Cannot generate master user due to some error!!";
            $scope.mClass="alert-danger";
            setTimeout(()=>{$window.location.href="./index.html"},5000);
        });
    };

    $scope.logOut=()=>{
        $rootScope.logOut();
        $window.location.href="#/home";
    }

    $rootScope.logOut=()=>{
        localStorage.clear();
        $rootScope.userIn="";
        $rootScope.loggedInM=false;
        $rootScope.loggedInA=false;
        $rootScope.loggedInS=false;
        $rootScope.loggedInC=false;
        $rootScope.loggedIn=false;
    };
});