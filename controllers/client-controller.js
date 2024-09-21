import initKnex from "knex";
import configuration from "../knexfile.js";
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const knex = initKnex(configuration);

export const getAllClients = async (req, res) => {
    try {
      const clients = await knex('clients')
      .select('*');
      res.json(clients);
    } catch (err) {
      handleServerError(res, err, 'Error fetching clients');
    }
  };
  
  export const getClient = async (req, res) => {
    try {
        const client = await knex('clients')
        .where({ id: req.params.id}).first();
        if (!client) {
            return res.status(404).json({
                messsage:`Client with Id ${req.params.id} not found`
            })
        }
        res.json(client);
    } catch(error) {
        res.status(500).send(`Error retrieving client: ${error}`)
    }
  };

  export const getClientWithAssetsAndProjects = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the client information
      const clientDetails = await knex('clients')
        .where({ id: id })
        .first();
  
      if (!clientDetails) {
        return res.status(404).json({ message: `Client with ID ${id} not found` });
      }
  
      // Fetch assets associated with the client
      const assets = await knex('assets')
        .where({ clients_id: id })
        .select('*');
  
      // Fetch projects associated with the client
      const projects = await knex('projects')
        .where({ clients_id: id })
        .select('*');
  
      // Combine client, assets, and projects information
      const clientWithAssetsAndProjects = {
        ...clientDetails,
        assets: assets,
        projects: projects
      };
  
      res.json(clientWithAssetsAndProjects);
    } catch (error) {
      console.error('Error fetching client with assets and projects:', error);
      res.status(500).json({ error: 'Error fetching client with assets and projects' });
    }
  };


  export const createClient = async (req, res) => {
    try {
      const clientData = { ...req.body };
      
      // Set default status 
      if (!clientData.status || !['active', 'inactive'].includes(clientData.status)) {
        clientData.status = 'active';
      }
  
      const newId = uuid();
      await knex('clients').insert({
        ...clientData,
        id: newId
      });
  
      const newClient = await knex("clients").where({ id: newId }).first();
      
      res.status(201).json(newClient);
    } catch (err) {
      console.error('Unable to create new client:', err);
      res.status(500).json({ error: 'Unable to create new client', details: err.message });
    }
  };

  export const deleteClient = async (req, res) => {
  const { id } = req.params;
  
  // Start a transaction to ensure data consistency
  const trx = await knex.transaction();

  try {
    // Check if the client exists
    const client = await trx('clients').where({ id }).first();
    if (!client) {
      await trx.rollback();
      return res.status(404).json({ message: `Client with ID ${id} not found` });
    }

    // Check for associated assets
    const associatedAssets = await trx('assets').where({ clients_id: id });
    if (associatedAssets.length > 0) {

      // Update assets to remove client association
      await trx('assets').where({ clients_id: id }).update({ clients_id: null });
    }

    // Check for associated projects
    const associatedProjects = await trx('projects').where({ clients_id: id });
    if (associatedProjects.length > 0) {

      // Update projects to remove client association
      await trx('projects').where({ clients_id: id }).update({ clients_id: null });
    }

    // Delete the client
    await trx('clients').where({ id }).del();

    // Commit the transaction
    await trx.commit();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    // Rollback the transaction in case of error
    await trx.rollback();
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Unable to delete client', details: error.message });
  }
};
