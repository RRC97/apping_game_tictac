const database = require('../database');
const crypto = require('crypto');

module.exports = {
    async register(req, res) {
        const username = req.body.username ? req.body.username : "";
        const password = req.body.password ? req.body.password : "";

        if(username != '' && password != '') {
            const existPlayer = await database('players').where('username', username);

            if(existPlayer.length < 1) {
                const result = await database('players').returning(['token', 'username', 'email']).insert({
                    username: username,
                    password: password,
                    token: crypto.randomBytes(32).toString('hex')
                });
        
                return res.send(result[0]);
            } else {
                return res.status(401).send({
                    errorcode: 3,
                    message: "This Username Already Exists"
                });
            }
        }
            
        return res.status(401).send({
            errorcode: 3,
            message: "This Username Already Exists"
        });
    },
    async login(req, res) {
        const username = req.body.username ? req.body.username : "";
        const password = req.body.password ? req.body.password : "";

        if(username != '' && password != '') {
            const existPlayer = await database('players')
                .returning(['username', 'token', 'email'])
                .where('username', username)
                .where('password', password);

            if(existPlayer.length > 0) {
                return res.send(existPlayer[0]);
            } else {
                return res.status(401).send({
                    errorcode: 4,
                    message: "Username or Password Invalid"
                });
            }
        }

        return res.status(401).send({
            errorcode: 4,
            message: "Username or Password Invalid"
        });
    }
}