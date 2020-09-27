
var user_token = localStorage.getItem("user_token");

 

function getUserInfos() {

    console.log(user_token);

    var headers = [
        { key: "Content-Type", value: "application/json" },
        { key: "X-Api-Token", value: "lSxw1oQ8zBd4ZhBAuapQyhjjfCSyiY2Y" }
    ]

    get(`http://25.43.203.103:3000/player?token=${user_token}`, undefined, function (response) {
        console.log(response);

        var user_object = JSON.parse(response);

        document.getElementById('player_name').innerText = user_object.username;

    }, 4, 200, headers)
}

getUserInfos();