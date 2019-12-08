app.factory("adminOpsFact",function($q,$http,PRODDEL,PRODADD,PRODADDONE,Upload){
    return{
        delProd(req){
            var defer=$q.defer();
            $http.post(PRODDEL,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        addOne(req){
            var defer=$q.defer();
            $http.post(PRODADDONE,req).then((data)=>{
                defer.resolve(data.data);
            },(err)=>{
                defer.reject(err.data);
            });
            return defer.promise;
        },
        addMany(file){
            console.log(localStorage.Shop384)
            let defer=$q.defer();
            Upload.upload({
                url: PRODADD,
                data: {"file": file, "token":localStorage.Shop384}
            }).then(function (resp) {
                console.log(resp);
                defer.resolve(resp["data"]);
                //$scope.res=resp["data"]["msg"];
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);alert("1");
            }, function (resp) {
                console.log(resp.data);
                console.log('Error status: ' + resp.status);alert("2");
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name); alert("3");
            }).catch((err)=>{
                console.log(err);alert("4");
                defer.reject(err.data)
            });
            return defer.promise;
        },
        test(fd){
            let defer=$q.defer();
            console.log(PRODADD)
            // AJAX request
            $http({
                method: 'post',
                url: PRODADD,
                data: {"file": fd, "token":localStorage.Shop384},
                headers: {'Content-Type': undefined},
            }).then(function successCallback(response) { 
                // Store response data
                defer.resolve(response.data);
            },(error)=>{
                defer.reject(error.data);
            });
           return defer.promise;
        }
    }
})