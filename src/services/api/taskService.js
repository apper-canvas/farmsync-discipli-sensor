import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay();
    return [...tasks];
  },

  async getById(id) {
    await delay();
    return tasks.find(task => task.Id === parseInt(id)) || null;
  },

  async getByFarm(farmId) {
    await delay();
    return tasks.filter(task => task.farmId === farmId);
  },

  async create(taskData) {
    await delay();
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      completed: false,
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) return null;
    
    const updatedTask = { ...tasks[index], ...taskData };
    
    // Set completedAt timestamp when marking as completed
    if (taskData.completed && !tasks[index].completed) {
      updatedTask.completedAt = new Date().toISOString();
    } else if (!taskData.completed) {
      updatedTask.completedAt = null;
    }
    
    tasks[index] = updatedTask;
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) return false;
    
    tasks.splice(index, 1);
    return true;
  },

  async toggleComplete(id) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) return null;
    
    tasks[index].completed = !tasks[index].completed;
    tasks[index].completedAt = tasks[index].completed 
      ? new Date().toISOString() 
      : null;
    
    return { ...tasks[index] };
  }
};