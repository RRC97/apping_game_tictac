const knex = require('knex');
const env = require('./env');

const database = knex(env.database.development);

module.exports = database;