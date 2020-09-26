const express = require('express');
const routes = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');

const ApiTokenMiddleware = require('./middlewares/ApiTokenMiddleware');
const UserTokenMiddleware = require('./middlewares/UserTokenMiddleware');

const AuthController = require('./controllers/AuthController');
const PlayerController = require('./controllers/PlayerController');
const MatchController = require('./controllers/MatchController');

routes.all('*', cors(), bodyParser.json(), bodyParser.urlencoded({extended: true}), ApiTokenMiddleware);

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

routes.get('/player', UserTokenMiddleware, PlayerController.index);

routes.post('/match/request', UserTokenMiddleware, MatchController.request);

module.exports = routes;