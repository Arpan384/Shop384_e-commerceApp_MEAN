//User routes
app.constant("MASTER","http://localhost:1234/user/master"); //done
app.constant("USERLOGIN","http://localhost:1234/user/login"); //done
app.constant("USERFETCH","http://localhost:1234/user/fetch"); //done
app.constant("USERREGISTER","http://localhost:1234/user/other"); //done
app.constant("ADMIN","http://localhost:1234/user/admin"); //done
app.constant("DELADMIN","http://localhost:1234/user/deladmin"); //done
app.constant("USERDEL","http://localhost:1234/user/delother"); //done
app.constant("USERUPDATE","http://localhost:1234/user/update"); //done

//Product routes
app.constant("PRODFETCHALL","http://localhost:1234/product/fetchall"); //done
app.constant("PRODFETCHHOME","http://localhost:1234/product/fetchhome"); //done
app.constant("PRODFETCHONE","http://localhost:1234/product/fetch"); //done
app.constant("PRODDEL","http://localhost:1234/product/delete"); //done
app.constant("PRODADD","http://localhost:1234/product/create"); //done
app.constant("PRODUPDATE","http://localhost:1234/product/update");  //done
app.constant("PRODUPDATEMASTER","http://localhost:1234/product/updatemaster"); //done
app.constant("PRODADDONE","http://localhost:1234/product/single"); //done
app.constant("PRODSELLER","http://localhost:1234/product/seller"); //done

//Order routes
app.constant("ORDERCREATE","http://localhost:1234/order/create"); //consumer
app.constant("ORDERCANCEL","http://localhost:1234/order/cancel"); //consumer,seller
app.constant("ORDERFETCH","http://localhost:1234/order/fetch"); //consumer,seller
app.constant("ORDERUPDATE","http://localhost:1234/order/update"); //seller

//Cart routes
app.constant("CARTADD","http://localhost:1234/cart/add"); //done
app.constant("CARTREMOVE","http://localhost:1234/cart/remove"); //done
app.constant("CARTFETCH","http://localhost:1234/cart/fetch"); //done