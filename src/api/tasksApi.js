import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

export const getTasks = () => API.get('/tasks').then(res => res.data);
export const addTask = (task) => API.post('/tasks', task);
export const updateTask = (task) => API.put(`/tasks/${task.id}`, task);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);