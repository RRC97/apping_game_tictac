
function updateUi(game_updade) {

    if (game_updade.status <= 0) {
        var table = game_updade.current;

        updateTable(table);
        
    }
    //Atualizar as informações dos usuários
    if (game_updade.creator && game_updade.oponent) {
        setPlayerInfos(game_updade.creator.username, game_updade.oponent.username)
    }

    setGameType(game_updade.type);

}

function setGameType(type) {

    switch (type) {
        case 0:
            $('#game_mode').text("Versus")
            break;
        case 1:
            $('#game_mode').text("Melhor de 3")
            break;
        case 2:
            $('#game_mode').text("Melhor de 5")
            break;
        case 3:
            $('#game_mode').text("Melhor de 10")
            break;
        case 4:
            $('#game_mode').text("Custom")
            break;
        case 5:
            $('#game_mode').text("Friendy")
            break;
    }
}

function setPlayerInfos(player_1, player_2) {
    $('#p1_name').text(player_1)
    $('#p2_name').text(player_2)
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

