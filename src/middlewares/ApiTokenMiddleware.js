const knexfile = require("../../knexfile");
const env = require('../env');
module.exports = (req, res, next) => {
    const token = req.get('X-Api-Token');

    if(token === env.api_token) {
        return next();
    } else {
        return res.status(401).send({
            errorcode: 1,
            message: 'Authentification Error'
        });
    }
}