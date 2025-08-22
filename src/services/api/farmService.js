import farmsData from "@/services/mockData/farms.json";

let farms = [...farmsData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const farmService = {
  async getAll() {
    await delay();
    return [...farms];
  },

  async getById(id) {
    await delay();
    return farms.find(farm => farm.Id === parseInt(id)) || null;
  },

  async create(farmData) {
    await delay();
    const newFarm = {
      ...farmData,
      Id: Math.max(...farms.map(f => f.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    farms.push(newFarm);
    return { ...newFarm };
  },

  async update(id, farmData) {
    await delay();
    const index = farms.findIndex(farm => farm.Id === parseInt(id));
    if (index === -1) return null;
    
    farms[index] = { ...farms[index], ...farmData };
    return { ...farms[index] };
  },

  async delete(id) {
    await delay();
    const index = farms.findIndex(farm => farm.Id === parseInt(id));
    if (index === -1) return false;
    
    farms.splice(index, 1);
    return true;
  }
};