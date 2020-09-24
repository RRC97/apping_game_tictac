var user_token = localStorage.getItem("user_token");

if(user_token){
    window.open('../home','_self')
}else{
    document.getElementById('container').style.display = 'block';
}