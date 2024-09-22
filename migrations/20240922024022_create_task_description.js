/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
      .alterTable('tasks', (table) => {
        // Add a column for the task description
        table.text('description').nullable();
        
        // Add a column for the task name
        table.string('task_name').nullable();
      });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema
      .alterTable('tasks', (table) => {
        // Remove the columns if we need to roll back
        table.dropColumn('description');
        table.dropColumn('task_name');
      });
}