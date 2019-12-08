app.factory("loginFact",($q,$http,USERLOGIN,USERFETCH,USERREGISTER,ADMIN)=>{
    return {
        login(user){
            let defer=$q.defer();
            $http.post(USERLOGIN,user).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        fetch(token){
            let defer=$q.defer();
            $http.post(USERFETCH,token).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err);
            });
            return defer.promise;
        },
        register(user){
            var req={user}
            let defer=$q.defer();
            $http.post(USERREGISTER,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        regAdmin(req){
            let defer=$q.defer();
            $http.post(ADMIN,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        }
    }
});