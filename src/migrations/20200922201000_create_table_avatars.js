
exports.up = function(knex) {
    return knex.schema.createTable('avatars', (table) => {
        table.increments('id');
        table.string('name');
        table.string('src');

        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('avatars');
};
