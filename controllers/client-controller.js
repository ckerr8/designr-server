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
  
//   export {
//     getAllClients
//   };
  
//   export const createClient = async (req, res) => {
//     try {
//       const id = uuid();
//       const newClient = await knex('clients').where({ key: newId }).first();
//       res.status(201).json(newClient);
//     } catch (err) {
//       handleServerError(res, err, 'Unable to create new client');
//     }
//   };