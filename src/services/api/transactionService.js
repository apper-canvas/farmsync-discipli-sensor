import transactionsData from "@/services/mockData/transactions.json";

let transactions = [...transactionsData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  async getAll() {
    await delay();
    return [...transactions];
  },

  async getById(id) {
    await delay();
    return transactions.find(transaction => transaction.Id === parseInt(id)) || null;
  },

  async getByFarm(farmId) {
    await delay();
    return transactions.filter(transaction => transaction.farmId === farmId);
  },

  async create(transactionData) {
    await delay();
    const newTransaction = {
      ...transactionData,
      Id: Math.max(...transactions.map(t => t.Id), 0) + 1
    };
    transactions.push(newTransaction);
    return { ...newTransaction };
  },

  async update(id, transactionData) {
    await delay();
    const index = transactions.findIndex(transaction => transaction.Id === parseInt(id));
    if (index === -1) return null;
    
    transactions[index] = { ...transactions[index], ...transactionData };
    return { ...transactions[index] };
  },

  async delete(id) {
    await delay();
    const index = transactions.findIndex(transaction => transaction.Id === parseInt(id));
    if (index === -1) return false;
    
    transactions.splice(index, 1);
    return true;
  }
};