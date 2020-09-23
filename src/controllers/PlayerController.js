module.exports = {
    async index(req, res) {
        return res.send(req.user);
    }
}