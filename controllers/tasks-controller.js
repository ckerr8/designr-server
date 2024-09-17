import initKnex from "knex";
import configuration from "../knexfile.js";
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const knex = initKnex(configuration);

export const getAllTasks = async (req, res) => {
    try {
      const tasks = await knex('tasks')
      .select('*');
      res.json(tasks);
    } catch (err) {
      handleServerError(res, err, 'Error fetching clients');
    }
  };

  export const getTaskById = async (req, res) => {
    try {
        const task = await knex('tasks')
        .where({ id: req.params.id}).first();
        if (!task) {
            return res.status(404).json({ message:`Task with Id ${req.params.id} not found`})
        }
        res.json(task);
    } catch (error) {
        res.status(500).send(`Error retrieving tasks: ${error}`)
    }
  }

  export const createTask = async (req, res) => {
    try {
        const [newId] = await knex('tasks').insert({
            ...req.body,
            id: uuid()
    });
        const newTask = await knex("tasks").where({ id: newId });
      res.status(201).json(newTask);
    } catch (error) {
      console.error(res, err, 'Unable to create new task');
    }
  };

  export const deleteTaskById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // First, check if the task exists
      const task = await knex('tasks')
        .where({ id: id })
        .first();
  
      if (!task) {
        return res.status(404).json({ message: `Task with Id ${id} not found` });
      }
  
      // If the task exists, delete it
      await knex('tasks')
        .where({ id: id })
        .del();
  
      res.status(200).json({ message: `Task with Id ${id} has been deleted successfully` });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: `Error deleting task: ${error.message}` });
    }
  };