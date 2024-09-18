/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
    .alterTable('assets', (table) => {
      table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active');
    })
      .alterTable('clients', (table) => {
        table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active');
      });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema
      .alterTable('clients', (table) => {
        table.dropColumn('status');
      })
      .alterTable('assets', (table) => {
        table.dropColumn('status');
      });
  }