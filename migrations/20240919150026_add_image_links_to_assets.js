/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
      .alterTable('assets', (table) => {
        // Add a column for the local image link
        table.string('local_image_path').nullable();
        
        // Add a column for the remote URL link
        table.string('remote_url').nullable();
      });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema
      .alterTable('assets', (table) => {
        // Remove the columns if we need to roll back
        table.dropColumn('local_image_path');
        table.dropColumn('remote_url');
      });
  }