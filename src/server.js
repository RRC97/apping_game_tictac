const express = require('express');
const app = express();
const routes = require('./routes');

app.use(routes);

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const database = require('./database');

const onlinePlayers = [

];

function isValidMove(data, x, y) {
    const board = JSON.parse(data);
    return (board[x][y] == 0);
}
function doMove(data, x, y, player) {
    const board = JSON.parse(data);
    board[x][y] = player;
    return board;
}
function isWinner(board) {
    var valueDiag1 = 0;
    var valueDiag2 = 0;
    for(var i = 0; i < board.length; i++) {
        var valueX = 0;
        var valueY = 0;
        for(var j = 0; j < board[i].length; j++) {
            valueX += board[i][j] == 0 ? -10 : board[i][j];
            valueY += board[j][i] == 0 ? -10 : board[j][i];
            if(i == j) {
                valueDiag1 += board[i][j] == 0 ? -10 : board[i][j];
            }
            if(i + j == 2) {
                valueDiag2 += board[i][j] == 0 ? -10 : board[i][j];
            }
        }
        if(valueX > 0 && valueX % 3 == 0) {
            return valueX / 3;
        }
        if(valueY > 0 && valueY % 3 == 0) {
            return valueY / 3;
        }
    }
    if(valueDiag1 != 0 && valueDiag1 % 3 == 0) {
        return valueDiag1 / 3;
    }

    if(valueDiag2 != 0 && valueDiag2 % 3 == 0) {
        return valueDiag2 / 3;
    }

    return 0;
}

io.on('connection', socket => {
    onlinePlayers[socket.id] = {};
    socket.on('token', async token => {
        const player = await database('players').where('token', token);
        if(player.length > 0) {
            onlinePlayers[socket.id] = player[0];
            const request = await database('match_requests')
                .where(builder=>{builder.where('status', 1).andWhere('creator_id', onlinePlayers[socket.id].id)})
                .orWhere(builder=>{builder.where('status', 1).andWhere('oponent_id', onlinePlayers[socket.id].id)});
            if(request.length > 0) {
                const match_request = request[0];
                onlinePlayers[socket.id].creator = (match_request.creator_id == onlinePlayers[socket.id].id);
                const ifMatchExists = await database('matches').where('request_id', match_request.id);
                if(ifMatchExists.length > 0) {
                    const match = ifMatchExists[0];
                    const response = await database('matches').where('id', match.id).returning('id').update({status: 1});
                    if(response.length > 0) {
                        socket.emit('token:success', onlinePlayers[socket.id]);
                        onlinePlayers[socket.id].room = match.id;
                        socket.join(match.id);
                    }
                } else {
                    const match = await database('matches').returning('id').insert({
                        request_id: match_request.id,
                        type: match_request.type
                    });
                    if(match.length > 0) {
                        socket.emit('token:success', onlinePlayers[socket.id]);
                        onlinePlayers[socket.id].room = match.id;
                        socket.join(match.id);
                    }
                }
            }
        } else {
            socket.emit('token:failed', 'Token inexistente');
        }
    });
    socket.on('chat-message', message => {
        const player = onlinePlayers[socket.id];
        io.sockets.in(player.room).emit('chat-message', {from: player, message: message});
    });
    socket.on('game-update', async () => {
        const player = onlinePlayers[socket.id];
        const match = await database('matches')
            .where('id', player.room);

        if(match.length > 0) {
            //console.log(match[0].data);
            match[0].creator = player.creator;
            socket.emit('game-update', match[0]);
        }
    });
    socket.on('game-move', async move => {
        const player = onlinePlayers[socket.id];
        const match = await database('matches')
            .where('id', player.room);
        if(match.length > 0) {
            if(match[0].winner == 0) {
                if((player.creator && match[0].turn == 0)
                || (!player.creator && match[0].turn == 1)) {
                    if(isValidMove(match[0].data, move.x, move.y)) {
                        const board = doMove(match[0].data, move.x, move.y, player.creator ? 1 : 2);
                        const winnerResult = isWinner(board);
                        const winner = winnerResult > 0 ? winnerResult : 0;
                        await database('matches')
                            .where('id', match[0].id)
                            .update({
                                data: JSON.stringify(board),
                                winner: winner,
                                turn: player.creator ? 1 : 0
                            });
                    } else {
                        socket.emit('game-move:failed', {error: 0});
                    }
                } else {
                    socket.emit('game-move:failed', {error: 1});
                }
            } else {
                socket.emit('game-move:failed', {error: 2, match: match[0]});
            }
            //await database('matches').where('id', match[0].id).update({data: '[[0,0,0],[0,0,0],[0,0,0]]', winner: 0}); 
        }
    });
});

http.listen(3000);