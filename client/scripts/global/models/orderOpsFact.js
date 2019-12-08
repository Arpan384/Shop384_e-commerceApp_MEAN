app.factory("orderOpsFact",function($q,$http,ORDERCREATE,ORDERFETCH,ORDERUPDATE,ORDERCANCEL){
    return{
        create(req){
            let defer=$q.defer()
            $http.post(ORDERCREATE,req).then((data)=>{
                defer.resolve(data.data)
            },(err)=>{
                data.reject(err.data)
            })
            return defer.promise
        },
        fetch(req){
            let defer=$q.defer()
            $http.post(ORDERFETCH,req).then((data)=>{
                defer.resolve(data.data)
            },(err)=>{
                data.reject(err.data)
            })
            return defer.promise
        },
        update(req){
            let defer=$q.defer()
            $http.post(ORDERUPDATE,req).then((data)=>{
                defer.resolve(data.data)
            },(err)=>{
                data.reject(err.data)
            })
            return defer.promise
        },
        cancel(req){
            let defer=$q.defer()
            $http.post(ORDERCANCEL,req).then((data)=>{
                defer.resolve(data.data)
            },(err)=>{
                data.reject(err.data)
            })
            return defer.promise
        }
    }
})