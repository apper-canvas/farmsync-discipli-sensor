import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import TaskCard from "@/components/organisms/TaskCard";
import TaskForm from "@/components/organisms/TaskForm";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";
import { differenceInDays, format } from "date-fns";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [farmFilter, setFarmFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" }
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Tasks loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`)) {
      try {
        await taskService.delete(task.Id);
        setTasks(prev => prev.filter(t => t.Id !== task.Id));
        toast.success("Task deleted successfully");
      } catch (err) {
        console.error("Delete task error:", err);
        toast.error("Failed to delete task");
      }
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await taskService.toggleComplete(task.Id);
      setTasks(prev => prev.map(t => t.Id === task.Id ? updatedTask : t));
      toast.success(updatedTask.completed ? "Task marked as complete" : "Task marked as pending");
    } catch (err) {
      console.error("Toggle task error:", err);
      toast.error("Failed to update task");
    }
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData);
        setTasks(prev => prev.map(t => t.Id === editingTask.Id ? updatedTask : t));
        toast.success("Task updated successfully");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success("Task added successfully");
      }
    } catch (err) {
      console.error("Submit task error:", err);
      toast.error(editingTask ? "Failed to update task" : "Failed to add task");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFarm = !farmFilter || task.farmId === farmFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    
    let matchesStatus = true;
    if (statusFilter === "pending") {
      matchesStatus = !task.completed;
    } else if (statusFilter === "completed") {
      matchesStatus = task.completed;
    } else if (statusFilter === "overdue") {
      const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date());
      matchesStatus = !task.completed && daysUntilDue < 0;
    }
    
    return matchesSearch && matchesFarm && matchesPriority && matchesStatus;
  });

  // Sort tasks: pending first (by due date), then completed
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  if (loading) return (
    <Layout title="Tasks" subtitle="Schedule and track farm activities">
      <Loading type="list" />
    </Layout>
  );

  if (error) return (
    <Layout title="Tasks" subtitle="Schedule and track farm activities">
      <Error message={error} onRetry={loadData} />
    </Layout>
  );

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const overdueCount = tasks.filter(t => {
    const daysUntilDue = differenceInDays(new Date(t.dueDate), new Date());
    return !t.completed && daysUntilDue < 0;
  }).length;

  return (
    <Layout title="Tasks" subtitle="Schedule and track farm activities">
      <div className="space-y-6">
        {/* Task Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-warning/10 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending Tasks</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-success/10 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-red-50 to-error/10 rounded-lg border border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertCircle" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <SearchBar
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-36"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              
              <Select
                value={farmFilter}
                onChange={(e) => setFarmFilter(e.target.value)}
                className="w-40"
              >
                <option value="">All Farms</option>
                {farms.map(farm => (
                  <option key={farm.Id} value={farm.Id}>
                    {farm.name}
                  </option>
                ))}
              </Select>
              
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-40"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          
          <Button onClick={handleAddTask}>
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        {/* Active Filters */}
        {(farmFilter || priorityFilter || statusFilter !== "all") && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {statusFilter !== "all" && (
              <Badge variant="primary">
                {statusOptions.find(s => s.value === statusFilter)?.label}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 hover:text-primary-800"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {farmFilter && (
              <Badge variant="secondary">
                {farms.find(f => f.Id === farmFilter)?.name}
                <button
                  onClick={() => setFarmFilter("")}
                  className="ml-1 hover:text-secondary-800"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {priorityFilter && (
              <Badge variant="accent">
                {priorityOptions.find(p => p.value === priorityFilter)?.label}
                <button
                  onClick={() => setPriorityFilter("")}
                  className="ml-1 hover:text-accent-800"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Tasks List */}
        {sortedTasks.length === 0 ? (
          tasks.length === 0 ? (
            <Empty
              icon="CheckSquare"
              title="No tasks created yet"
              message="Stay organized by scheduling your farm activities and keeping track of important tasks."
              actionLabel="Add Your First Task"
              onAction={handleAddTask}
            />
          ) : (
            <Empty
              icon="Search"
              title="No tasks found"
              message="No tasks match your current filters. Try adjusting your search criteria."
            />
          )
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task) => {
              const farm = farms.find(f => f.Id === parseInt(task.farmId));
              const crop = crops.find(c => c.Id === parseInt(task.cropId));
              
              return (
                <TaskCard
                  key={task.Id}
                  task={task}
                  farm={farm}
                  crop={crop}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              );
            })}
          </div>
        )}

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitTask}
          task={editingTask}
          farms={farms}
          crops={crops}
        />
      </div>
    </Layout>
  );
};

export default Tasks;