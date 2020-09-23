// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'app_game_tictac',
      user:     'postgres',
      password: '123'
    },
    migrations: {
      tableName: 'migrations',
      directory: `${__dirname}/src/migrations`
    }
  }

};
