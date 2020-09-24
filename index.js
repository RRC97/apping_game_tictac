var user_token = localStorage.getItem("user_token");

if(!user_token){
    window.open('./pages/login','_self');
}else{
    window.open('./pages/home','_self');
}