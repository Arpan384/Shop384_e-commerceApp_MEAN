app.factory("masterFact",($q,$http,MASTER)=>{
    return {
        fetchMaster(){
            var defer=$q.defer();
            $http.get(MASTER).then((data)=>{
                defer.resolve(data.data);
            },(error)=>{
                defer.reject(error.data);
            });
            return defer.promise;
        },
        genMaster(email){
            var req={user:{email:email}};
            var defer=$q.defer();
            $http.post(MASTER,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        }
    }
});