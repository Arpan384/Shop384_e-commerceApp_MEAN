app.factory("cartOpsFact",($q,$http,CARTADD,CARTFETCH,CARTREMOVE)=>{
    return{
        addToCart(req){ console.log("add to cart call")
            var defer=$q.defer();
            $http.post(CARTADD,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        fetchCart(token){
            var defer=$q.defer();
            $http.post(CARTFETCH,token).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        delCart(req){
            var defer=$q.defer();
            $http.post(CARTREMOVE,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        }
    }
})