const express = require('express');
const app = express();
const routes = require('./routes');

app.use(routes);

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const database = require('./database');

const onlinePlayers = [

];

io.on('connection', socket => {
    onlinePlayers[socket.id] = {};
    socket.on('token', async token => {
        const player = await database('players').where('token', token);
        if(player.length > 0) {
            onlinePlayers[socket.id] = player[0];
            const request = await database('match_requests')
                .where('creator_id', onlinePlayers[socket.id].id)
                .orWhere('oponent_id', onlinePlayers[socket.id].id);
            if(request.length > 0) {
                onlinePlayers[socket.id].request = request[0];
                const creator = await database('players')
                    .where('id', request[0].creator_id);
                const oponent = await database('players')
                    .where('id', request[0].oponent_id);
                if(creator.length > 0 && oponent.length > 0) {
                    onlinePlayers[socket.id].creator = creator[0];
                    onlinePlayers[socket.id].oponent = oponent[0];

                    socket.emit('token:success', onlinePlayers[socket.id]);
                    socket.join('room' + onlinePlayers[socket.id].request.id);
                }
            }
        } else {
            socket.emit('token:failed', 'Token inexistente');
        }
    });
});

http.listen(3000);