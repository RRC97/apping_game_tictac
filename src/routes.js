const express = require('express');
const routes = express.Router();
const cors = require('cors');

const ApiTokenMiddleware = require('./middlewares/ApiTokenMiddleware');
const UserTokenMiddleware = require('./middlewares/UserTokenMiddleware');

const AuthController = require('./controllers/AuthController');
const PlayerController = require('./controllers/PlayerController');
const MatchController = require('./controllers/MatchController');

routes.all('*', cors(), express.json(), ApiTokenMiddleware);

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

routes.get('/player', UserTokenMiddleware, PlayerController.index);

routes.post('/match/request', UserTokenMiddleware, MatchController.request);
routes.post('/match/search', UserTokenMiddleware, MatchController.search);

module.exports = routes;