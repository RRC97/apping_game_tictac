const express = require('express');
const routes = express.Router();
const cors = require('cors');

const ApiTokenMiddleware = require('./middlewares/ApiTokenMiddleware');
const UserTokenMiddleware = require('./middlewares/UserTokenMiddleware');

const AuthController = require('./controllers/AuthController');
const PlayerController = require('./controllers/PlayerController');

routes.all('*', cors(), express.json(), ApiTokenMiddleware);

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

routes.use(UserTokenMiddleware).get('/player', PlayerController.index);

module.exports = routes;