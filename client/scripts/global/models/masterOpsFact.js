app.factory("masterOpsFact",function($q,$http,ADMIN,DELADMIN,PRODUPDATEMASTER){
    return{
        fetchAdms(){
            let defer=$q.defer();
            $http.get(ADMIN).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        delAdm(req){
            let defer=$q.defer();
            $http.post(DELADMIN,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        updateProduct(req){
            let defer=$q.defer();
            $http.post(PRODUPDATEMASTER,req).then((data)=>{
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
})