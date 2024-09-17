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

  export const createTask = async (req, res) => {
    try {
        const [newId] = await knex('tasks').insert({
            ...req.body,
            id: uuid()
    });
        const newTask = await knex("tasks").where({ id: newId });
      res.status(201).json(newTask);
    } catch (err) {
      console.error(res, err, 'Unable to create new task');
    }
  };