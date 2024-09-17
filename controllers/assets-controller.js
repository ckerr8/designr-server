
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
    } catch (error) {
        res.status(500).send(`Error retrieving assets: ${error}`)
    }
  };

  export const getAssetById = async (req, res) => {
    try {
        const asset = await knex('assets')
        .where({ id: req.params.id}).first();
        if (!asset) {
            return res.status(404).json({ message:`Asset with Id ${req.params.id} not found`})
        }
        res.json(asset);
    } catch  {
        res.status(500).send(`Error retrieving asset: ${error}`)
    }
  };

  export const createAsset = async (req, res) => {
    try {
        const [newId] = await knex('assets').insert({
            ...req.body,
            id: uuid()
    });
        const newAsset = await knex("assets").where({ id: newId });
      res.status(201).json(newAsset);
    } catch (err) {
      handleServerError(res, err, 'Unable to create new asset');
    }
  };