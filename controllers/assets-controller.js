
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
      const assetData = { ...req.body };
      
      // Set default status if not provided
      if (!assetData.status) {
        assetData.status = 'active';
      }
  
      const newId = uuid();
      await knex('assets').insert({
        ...assetData,
        id: newId
      });
  
      const newAsset = await knex("assets").where({ id: newId }).first();
      
      res.status(201).json(newAsset);
    } catch (err) {
      console.error('Unable to create new asset:', err);
      res.status(500).json({ error: 'Unable to create new asset', details: err.message });
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
      // If there's a related task, proceed with deletion but return a warning
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

  export const updateAsset = async (req, res) => {
    const trx = await knex.transaction();

    try {
        const { id } = req.params;
        const { asset_name, category, quantity, clients_id, tasks_id, status, local_image_path, remote_url } = req.body;

        // Create updateData object with only allowed fields
        const updateData = {
            asset_name,
            category,
            quantity,
            clients_id,
            tasks_id,
            status,
            local_image_path,
            remote_url
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        // Check if the asset exists
        const asset = await trx('assets')
            .where({ id: id })
            .first();

        if (!asset) {
            await trx.rollback();
            return res.status(404).json({ message: `Asset with Id ${id} not found` });
        }

        // ... rest of your existing code for checking client and task relationships

        // Update the asset
        await trx('assets')
            .where({ id: id })
            .update(updateData);
  
      // If the task association is being removed, update the old task
      if (asset.tasks_id && (!updateData.tasks_id || updateData.tasks_id !== asset.tasks_id)) {
        await trx('tasks')
          .where({ id: asset.tasks_id })
          .update({ assets_id: null });
      }
  
      // If a new task is being associated, update the new task
      if (updateData.tasks_id && updateData.tasks_id !== asset.tasks_id) {
        await trx('tasks')
          .where({ id: updateData.tasks_id })
          .update({ assets_id: id });
      }
  
      // Fetch the updated asset
     
        // Fetch the updated asset
        const updatedAsset = await trx('assets')
            .where({ id: id })
            .first();

        await trx.commit();

        res.status(200).json(updatedAsset);
    } catch (error) {
        await trx.rollback();
        console.error('Error updating asset:', error);
        res.status(500).json({ error: `Error updating asset: ${error.message}` });
    }
};