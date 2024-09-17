/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema
    // Create clients table
    .createTable('clients', (table) => {
      table.string("id", 36).primary().defaultTo(knex.raw('(UUID())'));
      table.string('address').notNullable();
      table.string('city').notNullable();
      table.string('industry').notNullable();
      table.string('contact_name').notNullable();
      table.string('contact_position').notNullable();
      table.string('contact_phone').notNullable();
      table.string('contact_email').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })

    // Create assets table
    .createTable('assets', (table) => {
      table.string("id", 36).primary().defaultTo(knex.raw('(UUID())'));
      table.string('asset_name').notNullable();
      table.string('category').notNullable();
      table.string('status').notNullable();
      table.integer('quantity').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
      table.string('clients_id', 36);
      table.string('tasks_id', 36);
    })

    // Create projects table
    .createTable('projects', (table) => {
      table.string("id", 36).primary().defaultTo(knex.raw('(UUID())'));
      table.string('project_name').notNullable();
      table.text('description').nullable();
      table.string('image').nullable();
      table.date('deadline').nullable();
      table.decimal('price', 10, 2).nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
      table.string('clients_id', 36);
      table.string('assets_id', 36);
    })

    // Create tasks table
    .createTable('tasks', (table) => {
      table.string("id", 36).primary().defaultTo(knex.raw('(UUID())'));
      table.string('category').notNullable();
      table.string('status').notNullable();
      table.integer('quantity').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
      table.string('projects_id', 36);
    });

  // Add foreign key constraints
  await knex.schema
    .alterTable('projects', (table) => {
      table.foreign('clients_id').references('id').inTable('clients').onUpdate('CASCADE').onDelete('CASCADE');
      table.foreign('assets_id').references('id').inTable('assets').onUpdate('CASCADE').onDelete('CASCADE');
    })
    .alterTable('tasks', (table) => {
      table.foreign('projects_id').references('id').inTable('projects').onUpdate('CASCADE').onDelete('CASCADE');
    })
    .alterTable('assets', (table) => {
      table.foreign('clients_id').references('id').inTable('clients').onUpdate('CASCADE').onDelete('CASCADE');
      table.foreign('tasks_id').references('id').inTable('tasks').onUpdate('CASCADE').onDelete('CASCADE');
    });
}

  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
export async function down(knex) {
  // Drop tables in reverse order
  await knex.schema
    .dropTableIfExists('tasks')
    .dropTableIfExists('projects')
    .dropTableIfExists('assets')
    .dropTableIfExists('clients');
}