function setOnClickToRequestButtons(){
    var request_buttons = document.getElementsByClassName('btn_request');

    //Setar o on click nos computadores
    for(var r in request_buttons){

        var button = request_buttons[r];

        if(button.tagName){

            button.onclick = function(){
                sendRequest(this.dataset.type)
            }
        }

    }
}

setOnClickToRequestButtons();

function sendRequest(type){

    var params = {
        token:user_token,
        type:type
    }
    var headers = [
        {key:"Content-Type",value:"application/json"},
        {key:"X-Api-Token",value:"lSxw1oQ8zBd4ZhBAuapQyhjjfCSyiY2Y"},
    ]

    post(`http://25.43.203.103:3000/match/request`,JSON.stringify(params),function(response){

        var obj_response = JSON.parse(response);
       
        if(response != "" && obj_response.status != undefined){

            

            localStorage.setItem("match_type",type);
            window.open('../search','_self')
        }

    },4,200,headers)
}