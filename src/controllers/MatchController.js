const database = require('../database');
const { search } = require('../routes');
const { index } = require('./PlayerController');

module.exports = {
    async request(req, res) {
        const type = req.body.type ? req.body.type : 0;
        if(type === 0) {
            return res.send({error: 'Falta o tipo carai!'});
        }
        const existRequest = await database('match_requests')
            .where('creator_id', req.user.id)
            .orWhere('oponent_id', req.user.id);
        if(existRequest.length > 0) {
            return res.send(existRequest[0]);
        }
        const requests = await database('match_requests')
            .whereNot('creator_id', req.user.id)
            .where('status', 0)
            .where('type', parseInt(type));
        if(requests.length > 0) {
            const match = requests[0];
            const result = await database('match_requests').where('id', match.id).returning(['status', 'type']).update({
                oponent_id: req.user.id,
                status: 1
            });
            return res.send(result[0]);
        } else {
            const request = await database('match_requests').returning(['status', 'type']).insert({
                creator_id: req.user.id,
                type: parseInt(type)
            });
            if(request.length > 0) {
                return res.send(request[0]);
            }
        }
        return res.send(req.user);
    }
}