app.factory("userUpDelFact",($q,$http,USERUPDATE,USERDEL)=>{
    return{
        updateUser(token,email,password){
            var req={"user":{email,password},"token":token}
            var defer=$q.defer();
            $http.post(USERUPDATE,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        deleteUser(token){
            var req={token};
            var defer=$q.defer();
            $http.post(USERDEL,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        }
    }
});