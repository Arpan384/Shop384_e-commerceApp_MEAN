app.controller("soloCtrl",function($scope,$window,$rootScope,$routeParams,sellerOpsFact,masterOpsFact,orderOpsFact,loginFact,fetchProdFact,cartOpsFact){
    if(localStorage.Shop384){
        loginFact.fetch({token:localStorage.Shop384}).then((data)=>{
            if($rootScope.loggedInA){
                $scope.res="Access not allowed, redirecting to dashboard";
                setTimeout(() => {
                    $window.location.href="#/dashboard";
                }, 4000);
            }
        },(err)=>{
            $rootScope.logOut();
        });
    }
    fetchP=()=>{
        fetchProdFact.fetchOne({product:{productid:$routeParams.productid}}).then((data)=>{
            $scope.product=data.product;
            if(data.product.homepage)$scope.editHome="Remove from Home";
            else $scope.editHome="Add to Home";
        },(err)=>{
            $scope.res="Product not found";
            $window.location.href="#/products"
        });
    }
    fetchP()

    $scope.cart=()=>{
        cartOpsFact.addToCart({token: localStorage.Shop384, productid:$routeParams.productid}).then((data)=>{
            console.log(data)
        },(err)=>{
            console.log(err);
        })
    }

    $scope.homeToggle=()=>{  //not tested
        masterOpsFact.updateProduct({token: localStorage.Shop384, product: {productid:$routeParams.productid,
        homepage:!$scope.product.homepage}}).then((data)=>{
            console.log(data)
            fetchP()
        },(err)=>{
            console.log(err);
        })
    }

    $scope.formToggle=()=>{
        if(!$scope.updForm){
            for (key in $scope.product){
                $scope[key]=$scope.product[key]
            }
        }
        
        $scope.updForm=!$scope.updForm;
    }

    $scope.updateProd=()=>{
        var name,quantity,price,description,deliverycharges,picurl;
        if($scope.name)name=$scope.name
        if($scope.quantity)quantity=$scope.quantity
        if($scope.price)price=$scope.price
        if($scope.description)description=$scope.description; else description=$scope.product.description
        if($scope.deliverycharges)deliverycharges=$scope.deliverycharges; else deliverycharges=$scope.product.deliverycharges
        if($scope.picurl)picurl=$scope.picurl; else picurl=$scope.product.picurl;

        var req={token:localStorage.Shop384,product:{productid: $scope.product.productid, name, quantity, price, description, deliverycharges, picurl}};
        // for(let key in req.product){
        //     if(req.product[key]==undefined)delete req.product[key];
        // }
        sellerOpsFact.updateProduct(req).then((data)=>{
            $scope.res=data.message;
            document.querySelector("#res").classList.remove("hide");
            clear();
            fetchP()
            setTimeout(() => {
                document.querySelector("#res").classList.add("hide");
                $scope.res="";
                $scope.updForm=false;
            }, 4000);
        },(err)=>{
            document.querySelector("#res").classList.remove("hide");
            if(err.promptlogin){
                $scope.res="Illegal action, please login!";
                $rootScope.logOut();
                setTimeout(()=>{
                    $window.location.href="#/login"
                },5000)
            }
            else $scope.res=err.message;
            setTimeout(() => {
                document.querySelector("#res").classList.add("hide");
                $scope.res="";
                $scope.updForm=false;
            }, 4000);
        });
    }
    function clear(){
        $scope.productid="";
        $scope.sellerid="";
        $scope.name="";
        $scope.quantity="";
        $scope.price="";
        $scope.description="";
        $scope.deliverycharges="";
        $scope.picurl="";
    }

    $scope.buy=()=>{
        if(!$rootScope.loggedIn){
            $window.location.href="#/login"
        }
        else if(!$rootScope.loggedInC){
            $window.location.href="#/dashoard"
        }
        else{
            console.log("callbuy")
            document.getElementById("orderItem").style.display = 'block';
            document.body.classList.add("disablebg")
            document.getElementById("orderItem").style.opacity = 1;
            window.addEventListener('scroll', noScroll);
            noScroll();

        }
    }
    $scope.cancel=()=>{
        document.getElementById("orderItem").style.display = 'none';
        window.removeEventListener('scroll', noScroll);
        document.body.classList.remove("disablebg")
    }
    function noScroll() {
        window.scrollTo(0, 0);
      }
    $scope.order=()=>{
        //console.log("callorder")
        var req={token:localStorage.Shop384, order:{productid: $scope.product.productid, quantity: $scope.orderQty}}
        orderOpsFact.create(req).then((data)=>{
            console.log(data)
            $scope.cancel();
            fetchP()
        },(err)=>{
            console.log(err)
        })
    }
})