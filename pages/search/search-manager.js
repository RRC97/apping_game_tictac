var type = localStorage.getItem("match_type");

function searchMatch(){

    sendRequest(function(response){

        setTimeout(() => {
        
            searchMatch();
            
        }, 1000);

    },function(response){
        window.open('../game_room','_self');
    })
    
   
}

searchMatch();

function sendRequest(renew,next){

    var params = {
        token:user_token,
        type:type
    }
    var headers = [
        {key:"Content-Type",value:"application/json"},
        {key:"X-Api-Token",value:"lSxw1oQ8zBd4ZhBAuapQyhjjfCSyiY2Y"},
    ]

    post(`http://25.43.203.103:3000/match/request`,JSON.stringify(params),function(response){

        //console.log(response);

        console.log(JSON.parse(response))

        if(response != "" && JSON.parse(response).status == 0){
            renew(response)
        }else if(JSON.parse(response).status == 1){
            next(response)
        }

    },4,200,headers)
}

