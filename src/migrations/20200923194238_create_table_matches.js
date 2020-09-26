
exports.up = function(knex) {
    return knex.schema.createTable('matches', (table) => {
        table.increments('id');

        table.integer('request_id').notNullable();
        table.foreign('request_id').references('Match_requests:id');
        
        table.integer('winner').defaultTo(0);
        table.integer('turn').defaultTo(0);
        table.string('data').defaultTo('[[0,0,0],[0,0,0],[0,0,0]]');
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