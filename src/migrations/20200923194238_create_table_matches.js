
exports.up = function(knex) {
    return knex.schema.createTable('matches', (table) => {
        table.increments('id');

        table.integer('request_id').notNullable();
        table.foreign('request_id').references('Match_requests:id');
        
        table.string('winner').defaultTo('[]');
        table.integer('turn').defaultTo(0);
        table.text('data').defaultTo('[[[0,0,0],[0,0,0],[0,0,0]]]');
        table.integer('index').defaultTo(0);
        table.integer('length').defaultTo(1);
        table.text('chat').defaultTo('[]');
        table.text('moves').defaultTo('[]');
        table.integer('result').defaultTo(0);

        table.integer('status').defaultTo(0);
        table.integer('type').defaultTo(0);

        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('matches');
};