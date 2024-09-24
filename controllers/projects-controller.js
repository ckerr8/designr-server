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
          .select(
            'projects.*',
            'clients.contact_name as client_contact_name'
          )
          .leftJoin('clients', 'projects.clients_id', 'clients.id');
        res.json(projects);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
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
    const { project_name, description, deadline, price, clients_id, status } = req.body;
    
    const projectData = {
      project_name,
      description,
      clients_id,
      price: price ? parseFloat(price) : null
    };
    
    // Converts the deadline to a valid MySQL date format
    if (deadline) {
      const date = new Date(deadline);
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

export const createTaskForProject = async (req, res) => {
  try {
    const { task_name, description, category, status, quantity } = req.body;
    const projectid  = req.params.id; // Get project ID from route parameters

    // Validate required fields
    if (!task_name) {
      throw new Error('Task name is required');
    }

    // Prepare task data
    const taskData = {
      id: uuid(),
      task_name,
      description: description || '',
      category: category || 'General', // Default category if not provided
      status: status || 'active',     // Default status if not provided
      quantity: quantity ? parseInt(quantity, 10) : 1,
      projects_id: projectid
    };

    // Insert the new task into the database
    await knex('tasks').insert(taskData);

    // Retrieve and return the newly created task
    const newTask = await knex('tasks').where({ id: taskData.id }).first();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Unable to create new task:', err);
    res.status(400).json({ error: 'Unable to create new task', details: err.message });
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

  export const deleteProjectById = async (req, res) => {
    const trx = await knex.transaction();
  
    try {
      const { id } = req.params;
  
      // Check if the project exists
      const project = await trx('projects')
        .where({ id: id })
        .first();
  
      if (!project) {
        await trx.rollback();
        return res.status(404).json({ message: `Project with Id ${id} not found` });
      }
  
      // Fetch tasks associated with the project
      const tasks = await trx('tasks')
        .where({ projects_id: id })
        .select('id');
  
      // Update assets associated with the project's tasks
      for (const task of tasks) {
        await trx('assets')
          .where({ tasks_id: task.id })
          .update({ status: 'Available', tasks_id: null });
      }
  
      // Delete tasks associated with the project
      await trx('tasks')
        .where({ projects_id: id })
        .del();
  
      // Delete the project
      await trx('projects')
        .where({ id: id })
        .del();
  
      await trx.commit();
  
      res.status(200).json({ message: `Project with Id ${id} has been deleted successfully` });
    } catch (error) {
      await trx.rollback();
      console.error('Error deleting project:', error);
      res.status(500).json({ error: `Error deleting project: ${error.message}` });
    }
  };

  export const updateProject = async (req, res) => {
    const trx = await knex.transaction();
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // Convert deadline to MySQL date format if provided
      if (updatedData.deadline) {
        const date = new Date(updatedData.deadline);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        updatedData.deadline = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
  
      // Convert price to float if provided
      if (updatedData.price) {
        updatedData.price = parseFloat(updatedData.price);
      }
  
      await trx('projects')
        .where({ id: id })
        .update(updatedData);
  
      const updatedProject = await trx('projects')
        .where({ id: id })
        .first();
  
      if (!updatedProject) {
        await trx.rollback();
        return res.status(404).json({ message: `Project with ID ${id} not found` });
      }
  
      await trx.commit();
  
      res.status(200).json(updatedProject);
    } catch (error) {
      await trx.rollback();
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Error updating project', details: error.message });
    }
  };
