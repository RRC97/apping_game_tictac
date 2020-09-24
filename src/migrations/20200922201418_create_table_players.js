
exports.up = function(knex) {
    return knex.schema.createTable('players', (table) => {
        table.increments('id');
        table.string('username').unique().notNullable();
        table.string('email').nullable();
        table.string('password').notNullable();
        table.string('token').unique();
        
        table.integer('avatar_id').nullable();
        table.foreign('avatar_id').references('Avatars:id');
        
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('players');
};
