
exports.up = function(knex) {
    return knex.schema.createTable('matches', (table) => {
        table.increments('id');

        table.integer('request_id').notNullable();
        table.foreign('request_id').references('Match_requests:id');
        
        table.string('data').defaultTo('{}');
        table.text('chat').defaultTo('[]');

        table.integer('status').defaultTo(0);
        table.integer('type').defaultTo(0);

        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('matches');
};