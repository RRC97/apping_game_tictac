const database = require('../database');
const crypto = require('crypto');

module.exports = {
    async register(req, res) {
        const username = req.body.username;
        const password = req.body.password;

        const existPlayer = await database('players').select().where('username', username);

        if(existPlayer.length < 1) {
            const result = await database('players').returning('token').insert({
                username: username,
                password: password,
                token: crypto.randomBytes(32).toString('hex')
            });
    
            return res.send({
                token: result[0]
            });
        } else {
            return res.status(401).send({
                errorcode: 3,
                message: "This Username Already Exists"
            });
        }
        
        /**/
    },
    async login(req, res) {
        const username = req.body.username;
        const password = req.body.password;

        const existPlayer = await database('players').select()
            .where('username', username)
            .where('password', password);

        if(existPlayer.length > 0) {
            const player = existPlayer[0];

            return res.send({
                token: player.token
            });
        } else {
            return res.status(401).send({
                errorcode: 4,
                message: "Username or Password Invalid"
            });
        }
    }
}