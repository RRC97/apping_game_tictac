var user_token = localStorage.getItem('user_token');

var io = io('ws://25.43.203.103:3000');

io.on('connect', () => {

    console.log(`on connect`);

    //Enviar meu token para o servidor
    io.emit('token', user_token, (data) => {
        //console.log(data);
    })

    io.on('token:success', (player) => {
        //console.log('token-success');
        //console.log(player);
    })

    io.on('token:failed', (data) => {
        //console.log(data);
    })

    io.on('chat-message', (data) => {
        //console.log(data);

        var obj_message = data;

        addMessageToChatBox(obj_message);

    })

    var gameUpdate = function () {
       
        setTimeout(() => {

            io.emit('game-update', {}, (data) => {

            })

            gameUpdate();

        }, 1000);
    }

    gameUpdate();

    function getWinner(winner, creator) {
        switch (winner) {
            case 1:
                if (creator) {
                    return 'Você Ganhou essa bagaça';
                } else {
                    return 'Perdeu seu trouxa';
                }
                return '';
            case 2:
                if (!creator) {
                    return 'Você Ganhou essa bagaça';
                } else {
                    return 'Perdeu seu trouxa';
                }
                return '';
        }
    }

    io.on('game-update', (data) => {

        if (data.winner > 0) {
            var game_area = document.getElementById('game_area');

            game_area.innerHTML = `<h1 class="end-game-message">${getWinner(data.winner, data.creator)}</h1>`;

            gameUpdate = function (){};

        } else {
            updateUi(data);
        }
    })

});

function updateUi(data) {
    var table = JSON.parse(data.data);

    //console.log(data);

    updateTable(table);
}

clickBoxes();

//Setar o clique dos objetos
function clickBoxes() {
    var boxes = document.getElementsByClassName('box');

    for (var position in boxes) {
        if (boxes[position].tagName) {
            boxes[position].onclick = function (event) {

                var object = {
                    x: this.dataset.x,
                    y: this.dataset.y
                }

                io.emit('game-move', object);
            }
        }
    }
}

function updateTable(table) {
    var box_container_1 = document.getElementById('box_container_1');
    var box_container_2 = document.getElementById('box_container_2');
    var box_container_3 = document.getElementById('box_container_3');

    var row1 = table[0];
    box_container_1.getElementsByClassName('box')[0].style.backgroundImage = getImageFromTableData(row1[0]);
    box_container_1.getElementsByClassName('box')[1].style.backgroundImage = getImageFromTableData(row1[1]);
    box_container_1.getElementsByClassName('box')[2].style.backgroundImage = getImageFromTableData(row1[2]);
    var row2 = table[1];
    box_container_2.getElementsByClassName('box')[0].style.backgroundImage = getImageFromTableData(row2[0]);
    box_container_2.getElementsByClassName('box')[1].style.backgroundImage = getImageFromTableData(row2[1]);
    box_container_2.getElementsByClassName('box')[2].style.backgroundImage = getImageFromTableData(row2[2]);
    var row3 = table[2];
    box_container_3.getElementsByClassName('box')[0].style.backgroundImage = getImageFromTableData(row3[0]);
    box_container_3.getElementsByClassName('box')[1].style.backgroundImage = getImageFromTableData(row3[1]);
    box_container_3.getElementsByClassName('box')[2].style.backgroundImage = getImageFromTableData(row3[2]);

}

function getImageFromTableData(value) {
    switch (value) {
        case 0:
            return ``;
        case 1:
            return `url('../../src/circle.png')`;
        case 2:
            return `url('../../src/xis.png')`;
    }
}

function addMessageToChatBox(obj_message) {
    var chat_box = document.getElementById('chat_box');

    var li = document.createElement('li');
    li.innerHTML = `<b>${obj_message.from.username}:</b> ${obj_message.message}`;
    li.className = 'chat-message-item';

    chat_box.appendChild(li);
}

function sendMessage(input) {
    var message = input[0].value;

    io.emit('chat-message', message, function (data) {
        //console.log(data);
    });
}


