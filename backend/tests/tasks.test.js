const request = require('supertest');
const express = require('express');
const mysql = require('mysql2');

// Create a new express app for testing
const app = express();
app.use(express.json());

// Mock the database connection
const db = {
  query: jest.fn(),
};

// Import routes
const tasksRoute = require('../routes/tasks')(db);
app.use('/tasks', tasksRoute);

describe('Tasks API', () => {
  beforeEach(() => {
    db.query.mockReset(); // Reset mock data before each test
  });

  test('GET /all - Should return all tasks', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, [{ id: 1, task: 'Test task', completed: false }]);
    });

    const response = await request(app).get('/tasks/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: 1, task: 'Test task', completed: false }]);
  });

  test('POST /add - Should add a new task', async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app)
      .post('/tasks/add')
      .send({ task: 'New task' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ id: 1, task: 'New task', completed: false });
  });

  test('PUT /complete/:id - Should mark task as complete', async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).put('/tasks/complete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Task marked as complete' });
  });

  test('DELETE /delete/:id - Should delete a task', async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).delete('/tasks/delete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Task deleted' });
  });

  test('PUT /edit/:id - Should update a task', async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app)
      .put('/tasks/edit/1')
      .send({ task: 'Updated task' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Task updated successfully' });
  });

  test('GET /completed - Should return completed tasks', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, [{ id: 1, task: 'Completed task', completed: true }]);
    });

    const response = await request(app).get('/tasks/completed');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: 1, task: 'Completed task', completed: true }]);
  });

  test('GET /pending - Should return pending tasks', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, [{ id: 1, task: 'Pending task', completed: false }]);
    });

    const response = await request(app).get('/tasks/pending');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: 1, task: 'Pending task', completed: false }]);
  });
});
