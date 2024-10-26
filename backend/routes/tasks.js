const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Add a new task
  router.post('/add', (req, res) => {
    const { task } = req.body;
    const query = 'INSERT INTO tasks (task, completed) VALUES (?, ?)';
    db.query(query, [task, false], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, task, completed: false });
    });
  });

  // Get all tasks
  router.get('/all', (req, res) => {
    const query = 'SELECT * FROM tasks';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // Mark task as complete
  router.put('/complete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE tasks SET completed = ? WHERE id = ?';
    db.query(query, [true, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task marked as complete' });
    });
  });

  // Edit a task
  router.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;  // Get new task description
    const query = 'UPDATE tasks SET task = ? WHERE id = ?';
    db.query(query, [task, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task updated successfully' });
    });
  });

  // Get completed tasks
  router.get('/completed', (req, res) => {
    const query = 'SELECT * FROM tasks WHERE completed = true';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // Get pending tasks
  router.get('/pending', (req, res) => {
    const query = 'SELECT * FROM tasks WHERE completed = false';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // Delete a task by ID
  router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted' });
    });
  });

  return router;
};
