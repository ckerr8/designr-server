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

  export const createClient = async (req, res) => {
    try {
        const [newId] = await knex('clients').insert({
            ...req.body,
            id: uuid()
    });
        const newClient = await knex("clients").where({ id: newId });
      res.status(201).json(newClient);
    } catch (err) {
      handleServerError(res, err, 'Unable to create new client');
    }
  };
