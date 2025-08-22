const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "farmId" } },
          { field: { Name: "cropId" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "completedAt" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('Tasks', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  },

  async getById(id) {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "farmId" } },
          { field: { Name: "cropId" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "completedAt" } }
        ]
      };
      
      const response = await apperClient.getRecordById('Tasks', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  },

  async getByFarm(farmId) {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "farmId" } },
          { field: { Name: "cropId" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "completedAt" } }
        ],
        where: [
          {
            FieldName: "farmId",
            Operator: "EqualTo",
            Values: [farmId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('Tasks', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by farm:", error);
      return [];
    }
  },

  async create(taskData) {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [
          {
            ...taskData,
            completed: false,
            completedAt: null
          }
        ]
      };
      
      const response = await apperClient.createRecord('Tasks', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating task:", error);
      return null;
    }
  },

  async update(id, taskData) {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = { ...taskData };
      
      // Set completedAt timestamp when marking as completed
      if (taskData.completed && !taskData.completedAt) {
        updateData.completedAt = new Date().toISOString();
      } else if (!taskData.completed) {
        updateData.completedAt = null;
      }
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      };
      
      const response = await apperClient.updateRecord('Tasks', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update tasks ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating task:", error);
      return null;
    }
  },

  async delete(id) {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('Tasks', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete tasks ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  },

  async toggleComplete(id) {
    await delay();
    try {
      // First get the current task
      const currentTask = await this.getById(id);
      if (!currentTask) return null;
      
      const updatedTask = await this.update(id, {
        completed: !currentTask.completed,
        completedAt: !currentTask.completed ? new Date().toISOString() : null
      });
      
      return updatedTask;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      return null;
    }
  }
};