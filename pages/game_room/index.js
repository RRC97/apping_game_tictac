var user_token = localStorage.getItem('user_token');

var io = io('ws://25.43.203.103:3000');

var game_status = {};

io.on('connect', () => {

    console.log(`on connect`);

    //Enviar meu token para o servidor
    io.emit('token', user_token, (data) => {
        //console.log(data);
    })

    io.on('token:success', (player) => {
        //console.log('token-success');
        console.log(player);
    })

    io.on('token:failed', (data) => {
        //console.log(data);
    })

    io.on('chat-message', (data) => {
        //console.log(data);

        var obj_message = data;

        addMessageToChatBox(obj_message);

    })

    io.emit('game-update', {}, (data) => {
        
    })


    /*var gameUpdate = function () {

        setTimeout(() => {

            io.emit('game-update', {}, (data) => {

            })

            gameUpdate();

        }, 1000);
    }

    gameUpdate();*/

    io.on('game-update', (data) => {

        updateUi(data)

        game_status = data;
        
        if (data.result > 0) {
            var game_area = document.getElementById('game_area');

            game_area.innerHTML = `<h1 class="end-game-message">${getWinner(data.result, data.isCreator)}</h1>`;

            gameUpdate = function () { };

        } else {
            updateUi(data);
        }
    })

});

function getWinner(winner, isCreator) {
    switch (winner) {
        case 1:
            if (isCreator) {
                return 'Você Ganhou essa bagaça';
            } else {
                return 'Perdeu seu trouxa';
            }
            return '';
        case 2:
            if (!isCreator) {
                return 'Você Ganhou essa bagaça';
            } else {
                return 'Perdeu seu trouxa';
            }
            return '';
    }
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

$('#send_button').click(function () {
    var message = $('#input_message').val();

    io.emit('chat-message', message, function (data) {
        //console.log(data);
    });
})

$('#input_message').keypress(function (event) {

    if (event.code == 'Enter') {
        if (this.value != '') {
            $('#send_button').click();
            this.value = '';
        }
    }
})


function addMessageToChatBox(obj_message) {
    var chat_box = document.getElementById('chat_box');

    var li = document.createElement('li');
    li.innerHTML = `<b>${obj_message.from.username}:</b> ${obj_message.message}`;
    li.className = 'chat-message-item';

    chat_box.appendChild(li);
}


