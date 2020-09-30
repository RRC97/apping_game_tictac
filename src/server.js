const express = require('express');
const app = express();
const routes = require('./routes');

app.use(routes);

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const database = require('./database');

const onlinePlayers = [

];

function createBoard() {
    const board = [];

    for(var i = 0; i < 3; i++) {
        var line = []
        for(var j = 0; j < 3; j++) {
            line.push(0);
        }
        board.push(line);
    }
    return board;
}

function isValidMove(board, x, y) {
    return (board[x][y] == 0);
}
function doMove(data, x, y, player) {
    data[x][y] = player;
    return data;
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
                    var length = 1;

                    switch(match_request.type) {
                        case 1:
                            length = 3;
                            break;
                        case 2:
                            length = 5;
                            break;
                        case 3:
                            length = 10;
                            break;
                        case 4:
                            length = 1;
                            break;
                        case 5:
                            length = 1;
                            break;
                    }
                    const match = await database('matches').returning('id').insert({
                        request_id: match_request.id,
                        id: match_request.id,
                        type: match_request.type,
                        length: length
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
    socket.on('chat-message', async message => {
        const player = onlinePlayers[socket.id];
        const match = await database('matches')
            .where('id', player.room).returning(['chat']);
        if(match.length > 0) {
            const chat = JSON.parse(match[0].chat);
            chat.push({from: player.id, message: message});
            await database('matches')
                .where('id', player.room)
                .update({chat: JSON.stringify(chat)});

            io.sockets.in(player.room).emit('chat-message', {from: player, message: message});
        }
    });
    socket.on('game-update', async () => {
        const player = onlinePlayers[socket.id];
        const response = await database('matches')
            .where('id', player.room);

        if(response.length > 0) {
            var match = response[0];
            players = io.sockets.in(player.room).sockets;
            for(var socketPlayer in players) {
                if(onlinePlayers[socketPlayer] == player) {
                    if(player.creator) {
                        match.creator = player;
                    } else {
                        match.oponent = player;
                    }
                } else {
                    if(!player.creator) {
                        match.creator = onlinePlayers[socketPlayer];
                    } else {

                        match.oponent = onlinePlayers[socketPlayer];
                    }
                }
            };
            match.current = JSON.parse(match.data)[match.index];
            match.isCreator = player.creator;
            socket.emit('game-update', match);
        }
    });
    socket.on('game-move', async move => {
        const player = onlinePlayers[socket.id];
        const match = await database('matches')
            .where('id', player.room);
        if(match.length > 0) {
            if(match[0].status < 2) {
                if((player.creator && match[0].turn == 0)
                || (!player.creator && match[0].turn == 1)) {
                    const rounds = JSON.parse(match[0].data);
                    if(isValidMove(rounds[match[0].index], move.x, move.y)) {
                        const board = doMove(rounds[match[0].index], move.x, move.y, player.creator ? 1 : 2);
                        
                        const winnerResult = isWinner(board);
                        const roundWinner = winnerResult > 0 ? winnerResult : 0;

                        var winner = JSON.parse(match[0].winner);
                        var status = match[0].status;
                        var index = match[0].index;
                        var matchResult = 0;
                        if(roundWinner) {
                            winner[match[0].index] = roundWinner;

                            var winnerCreator = 0;
                            var winnerOponent = 0;

                            for(var i = 0; i < winner.length; i++) {
                                console.log(winner[i]);
                                if(winner[i] == 1) {
                                    winnerCreator++;
                                } else if(winner[i] == 2) {
                                    winnerOponent++;
                                }
                            }
                            if(winnerCreator > match[0].length / 2) {
                                status++;
                                matchResult = 1;
                            } else if(winnerOponent > match[0].length / 2) {
                                status++;
                                matchResult = 2;
                            } else {
                                index++;
                                rounds.push(createBoard());
                            }
                        }

                        const moves = JSON.parse(match[0].moves);
                        moves.push({index: match[0].index, player: player.id, move: {x: move.x, y: move.y}});

                        const response = await database('matches')
                            .where('id', match[0].id)
                            .update({
                                winner: JSON.stringify(winner),
                                moves: JSON.stringify(moves),
                                data: JSON.stringify(rounds),
                                turn: player.creator ? 1 : 0,
                                status: status,
                                index: index,
                                result: matchResult
                            }).returning('*');

                        if(response.length > 0) {
                            var matchUpdate = response[0];
                            players = io.sockets.in(player.room).sockets;
                            for(var socketPlayer in players) {
                                if(onlinePlayers[socketPlayer] == player) {
                                    if(player.creator) {
                                        matchUpdate.creator = player;
                                    } else {
                                        matchUpdate.oponent = player;
                                    }
                                } else {
                                    if(!player.creator) {
                                        matchUpdate.creator = onlinePlayers[socketPlayer];
                                    } else {
                                        matchUpdate.oponent = onlinePlayers[socketPlayer];
                                    }
                                }
                            }
                            matchUpdate.current = JSON.parse(matchUpdate.data)[matchUpdate.index];
                            matchUpdate.isCreator = player.creator;
                            io.sockets.in(player.room).emit('game-update', matchUpdate);
                        }
                    } else {
                        socket.emit('game-move:failed', {error: 0});
                    }
                } else {
                    socket.emit('game-move:failed', {error: 1});
                }
            } else {
                socket.emit('game-move:failed', {error: 2, match: match[0]});
            }
        }
    });
});

http.listen(3000);