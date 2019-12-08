window.addEventListener("load",bindEvents);
function bindEvents(){
    document.addEventListener("scroll",scr);
}
function scr(){
    var body = window.document.body; //IE 'quirks'
    var document = window.document.documentElement; //IE with doctype
    document = (document.clientHeight) ? document : body;
    var navbar=document.querySelector("#nav");
    if (document.scrollTop == 0) {
        navbar.classList.remove("fixed-top");
    }        
    else{
        if(!navbar.classList.contains("fixed-top")){navbar.classList.add("fixed-top");}
    }
}