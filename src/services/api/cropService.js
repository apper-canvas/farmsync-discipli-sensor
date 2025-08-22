import cropsData from "@/services/mockData/crops.json";

let crops = [...cropsData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const cropService = {
  async getAll() {
    await delay();
    return [...crops];
  },

  async getById(id) {
    await delay();
    return crops.find(crop => crop.Id === parseInt(id)) || null;
  },

  async getByFarm(farmId) {
    await delay();
    return crops.filter(crop => crop.farmId === farmId);
  },

  async create(cropData) {
    await delay();
    const newCrop = {
      ...cropData,
      Id: Math.max(...crops.map(c => c.Id), 0) + 1
    };
    crops.push(newCrop);
    return { ...newCrop };
  },

  async update(id, cropData) {
    await delay();
    const index = crops.findIndex(crop => crop.Id === parseInt(id));
    if (index === -1) return null;
    
    crops[index] = { ...crops[index], ...cropData };
    return { ...crops[index] };
  },

  async delete(id) {
    await delay();
    const index = crops.findIndex(crop => crop.Id === parseInt(id));
    if (index === -1) return false;
    
    crops.splice(index, 1);
    return true;
  }
};