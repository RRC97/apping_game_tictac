function checkAndLogin() {
    var inputs = document.getElementsByClassName('input-form');

    var errors_labels = document.getElementsByClassName('error-label');

    //Esconder mensagens de error
    for (var e in errors_labels) {
        if (errors_labels[e].tagName) {
            errors_labels[e].style.display = 'none';
        }
    }

    //Quantidade de erros
    var errors = 0;

    //Verificar os campos de texto
    if (inputs[0].value == "") {

        errors_labels[0].style.display = 'block';
        errors_labels[0].innerText = "Digite um nome de usuário"
        errors++;
    }

    if (inputs[1].value == "") {
        errors_labels[1].style.display = 'block';
        errors_labels[1].innerText = "Digite uma senha"
        errors++;
    }

    
    if (errors > 0) {
        return;
    }

    //Encriptar senha
    var password_md5 = cryptoPassword(inputs[1].value);
    //console.log(password_md5);

    loginUser(inputs[0].value,password_md5);
}

//Registrando o usuário
function loginUser(username,password){

    var params = {
        username:username,
        password:password
    }
    var headers = [
        {key:"Content-Type",value:"application/json"},
        {key:"X-Api-Token",value:"lSxw1oQ8zBd4ZhBAuapQyhjjfCSyiY2Y"},
    ]
    
    post('http://25.43.203.103:3000/login',JSON.stringify(params),function(response){
         
        var obj_response =JSON.parse(response);
        var user_token = obj_response.token;

        localStorage.setItem("user_token",user_token);

        window.open('../home','_self');

    },4,200,headers)
}