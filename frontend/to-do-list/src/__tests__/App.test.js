import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('node-fetch'); // Mock fetch to avoid actual API calls
const fetch = require('node-fetch');

describe('Todo List App', () => {
  beforeEach(() => {
    fetch.mockClear(); // Clear fetch mock data before each test
  });

  test('renders add task input and button', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText(/Add new task/i);
    const buttonElement = screen.getByText(/Add Task/i);
    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  test('can add a task', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ id: 1, task: 'Test task', completed: false }),
    });

    render(<App />);
    
    fireEvent.change(screen.getByPlaceholderText(/Add new task/i), {
      target: { value: 'Test task' },
    });
    fireEvent.click(screen.getByText(/Add Task/i));

    const taskElement = await screen.findByText(/Test task/i);
    expect(taskElement).toBeInTheDocument();
  });

  test('can mark a task as complete', async () => {
    // Mock fetch to return an initial task
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([{ id: 1, task: 'Test task', completed: false }]),
    });
    render(<App />);

    // Wait for the task to appear
    const taskElement = await screen.findByText(/Test task/i);

    // Mock the mark complete API
    fetch.mockResolvedValueOnce({ json: jest.fn() });
    fireEvent.click(screen.getByText(/Complete/i));

    expect(taskElement).toHaveStyle('text-decoration: line-through'); // Check if task is styled as complete
  });

  test('can edit a task', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([{ id: 1, task: 'Test task', completed: false }]),
    });
    render(<App />);

    const taskElement = await screen.findByText(/Test task/i);
    
    // Simulate clicking edit button
    fireEvent.click(screen.getByText(/Edit/i));

    // Change the input value and update
    fireEvent.change(screen.getByPlaceholderText(/Edit task/i), {
      target: { value: 'Updated task' },
    });
    fetch.mockResolvedValueOnce({ json: jest.fn() });
    fireEvent.click(screen.getByText(/Update/i));

    expect(await screen.findByText(/Updated task/i)).toBeInTheDocument();
  });

  test('can delete a task', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([{ id: 1, task: 'Test task', completed: false }]),
    });
    render(<App />);
    
    const taskElement = await screen.findByText(/Test task/i);
    
    // Mock delete API
    fetch.mockResolvedValueOnce({ json: jest.fn() });
    fireEvent.click(screen.getByText(/Delete/i));

    expect(taskElement).not.toBeInTheDocument(); // Check if task is deleted
  });
});
  