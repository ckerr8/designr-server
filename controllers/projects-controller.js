import initKnex from "knex";
import configuration from "../knexfile.js";
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const knex = initKnex(configuration);

export const getAllProjects = async (req, res) => {
    try {
      const projects = await knex('projects')
      .select('*');
      res.json(projects);
    } catch (err) {
      handleServerError(res, err, 'Error fetching clients');
    }
  };

  export const getProjectById = async (req, res) => {
    try {
        const project = await knex('projects')
        .where({ id: req.params.id}).first();
        if (!project) {
            return res.status(404).json({
            message: `Project with Id ${req.params.id} does not exist`
            })
        }
    res.json(project);
    } catch (error) {
        return res.status(500).json({
        messsage:`Error retrieving project with ID ${req.params.id}`
        })
    }
};

  export const createProject = async (req, res) => {
    try {
      const projectData = { ...req.body };
      
      // Convert the deadline to a valid MySQL date format
      if (projectData.deadline) {
        const date = new Date(projectData.deadline);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        projectData.deadline = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
  
      const [newId] = await knex('projects').insert({
        ...projectData,
        id: uuid()
      });
  
      const newProject = await knex("projects").where({ id: newId }).first();
      res.status(201).json(newProject);
    } catch (err) {
      console.error('Unable to create new project:', err);
      res.status(400).json({ error: 'Unable to create new project', details: err.message });
    }
  };
  

  export const getProjectWithTasks = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Fetch the project information
      const projectDetails = await knex('projects')
        .where({ id: id })
        .first();
  
      if (!projectDetails) {
        return res.status(404).json({ message: `Project with ID ${id} not found` });
      }
  
      // Fetch tasks associated with the project
      const tasks = await knex('tasks')
        .where({ projects_id: id }) // This line is crucial
        .select('*');
  
      // Combine project and tasks information
      const projectWithTasks = {
        ...projectDetails,
        tasks: tasks
      };
  
      res.json(projectWithTasks);
    } catch (error) {
      console.error('Error fetching project with tasks:', error);
      res.status(500).json({ error: 'Error fetching project with tasks' });
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