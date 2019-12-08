app.factory("fetchProdFact",($q,$http,PRODFETCHALL,PRODFETCHHOME,PRODFETCHONE,PRODSELLER)=>{
    return {
        fetchAll(){
            var defer=$q.defer();
            $http.get(PRODFETCHALL).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        fetchHome(){
            var defer=$q.defer();
            $http.get(PRODFETCHHOME).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        fetchOne(req){
            var defer=$q.defer();
            $http.post(PRODFETCHONE,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        fetchSeller(req){
            var defer=$q.defer();
            $http.post(PRODSELLER,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        }
    }
});