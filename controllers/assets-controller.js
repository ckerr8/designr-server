import initKnex from "knex";
import configuration from "../knexfile.js";
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const knex = initKnex(configuration);

export const getAllAssets = async (req, res) => {
    try {
      const assets = await knex('assets')
      .select('*');
      res.json(assets);
    } catch (err) {
      handleServerError(res, err, 'Error fetching assets');
    }
  };