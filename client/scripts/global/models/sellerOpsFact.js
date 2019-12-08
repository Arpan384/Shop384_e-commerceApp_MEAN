app.factory("sellerOpsFact",function($q,$http,PRODUPDATE){
    return{
        updateProduct(req){
            let defer=$q.defer();
            $http.post(PRODUPDATE,req).then((data)=>{
                defer.resolve(data.data)
            },(err)=>{
                defer.reject(err.data)
            });
            return defer.promise;
        }
    }
})