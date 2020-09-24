
exports.up = function(knex) {
    return knex.schema.createTable('match_requests', (table) => {
        table.increments('id');
        
        table.integer('creator_id').notNullable();
        table.foreign('creator_id').references('Users:id');

        table.integer('oponent_id').nullable();
        table.foreign('oponent_id').references('Users:id');
        
        table.integer('status').defaultTo(0);
        table.integer('type').defaultTo(0);

        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('match_requests');
};