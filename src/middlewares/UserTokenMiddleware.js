const database = require('../database');

module.exports = async (req, res, next) => {
    const token = req.query.token ? req.query.token : req.body.token ? req.body.token : "";
    const result = await database('players').select().where('token', token);

    if(result.length > 0) {
        req.user = result[0];
        return next();
    } else {
        return res.status(401).send({
            errorcode: 2,
            message: "Error User Token Authentification"
        });
    }

}