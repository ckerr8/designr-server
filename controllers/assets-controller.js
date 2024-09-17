
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

  export const deleteAssetById = async (req, res) => {
    const trx = await knex.transaction();
  
    try {
      const { id } = req.params;
  
      // Check if the asset exists
      const asset = await trx('assets')
        .where({ id: id })
        .first();
  
      if (!asset) {
        await trx.rollback();
        return res.status(404).json({ message: `Asset with Id ${id} not found` });
      }
      // If there's a related task, we'll proceed with deletion but return a warning
      let warningMessage = null;
      if (asset.tasks_id) {
        warningMessage = `Asset is associated with a task (Task ID: ${asset.tasks_id}). The task will be updated.`;
        
        // Update the related task to remove the association
        await trx('tasks')
          .where({ id: asset.tasks_id })
          .update({ assets_id: null });
      }
  
      // Delete the asset
      await trx('assets')
        .where({ id: id })
        .del();
  
      await trx.commit();
  
      // Return success message along with any warning
      const responseMessage = {
        message: `Asset with Id ${id} has been deleted successfully`,
        warning: warningMessage
      };
  
      res.status(200).json(responseMessage);
    } catch (error) {
      await trx.rollback();
      console.error('Error deleting asset:', error);
      res.status(500).json({ error: `Error deleting asset: ${error.message}` });
    }
  };