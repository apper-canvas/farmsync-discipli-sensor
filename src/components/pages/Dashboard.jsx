import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import StatCard from "@/components/molecules/StatCard";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import TaskCard from "@/components/organisms/TaskCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { transactionService } from "@/services/api/transactionService";
import { weatherService } from "@/services/api/weatherService";
import { format, differenceInDays, startOfMonth } from "date-fns";

const Dashboard = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [farmsData, cropsData, tasksData, transactionsData, weatherData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getForecast()
      ]);
      
      setFarms(farmsData);
      setCrops(cropsData);
      setTasks(tasksData);
      setTransactions(transactionsData);
      setWeather(weatherData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleTaskToggle = async (task) => {
    try {
      const updatedTask = await taskService.toggleComplete(task.Id);
      setTasks(prev => prev.map(t => t.Id === task.Id ? updatedTask : t));
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  if (loading) return (
    <Layout title="Dashboard" subtitle="Farm overview and key metrics">
      <Loading type="cards" />
    </Layout>
  );

  if (error) return (
    <Layout title="Dashboard" subtitle="Farm overview and key metrics">
      <Error message={error} onRetry={loadDashboardData} />
    </Layout>
  );

  // Calculate dashboard metrics
  const activeCrops = crops.length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const urgentTasks = tasks.filter(task => {
    if (task.completed) return false;
    const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date());
    return daysUntilDue <= 1;
  }).length;

  const monthStart = startOfMonth(new Date());
  const monthlyTransactions = transactions.filter(t => new Date(t.date) >= monthStart);
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const monthlyBalance = monthlyIncome - monthlyExpenses;

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recentCrops = crops
    .sort((a, b) => new Date(b.plantingDate) - new Date(a.plantingDate))
    .slice(0, 4);

  return (
    <Layout title="Dashboard" subtitle="Farm overview and key metrics">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Crops"
            value={activeCrops}
            icon="Wheat"
            gradient="secondary"
            trend={activeCrops > 0 ? "up" : null}
            trendValue={activeCrops > 0 ? `${activeCrops} growing` : null}
          />
          
          <StatCard
            title="Pending Tasks"
            value={pendingTasks}
            icon="CheckSquare"
            gradient="warning"
            trend={urgentTasks > 0 ? "up" : null}
            trendValue={urgentTasks > 0 ? `${urgentTasks} urgent` : null}
          />
          
          <StatCard
            title="Monthly Balance"
            value={`$${monthlyBalance.toLocaleString()}`}
            icon="DollarSign"
            gradient={monthlyBalance >= 0 ? "success" : "error"}
            trend={monthlyBalance >= 0 ? "up" : "down"}
            trendValue={`$${Math.abs(monthlyBalance).toLocaleString()}`}
          />
          
          <StatCard
            title="Total Farms"
            value={farms.length}
            icon="MapPin"
            gradient="primary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Tasks */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 font-display">
                  Upcoming Tasks
                </h2>
                <Button size="sm" className="text-sm">
                  View All Tasks
                  <ApperIcon name="ArrowRight" className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {upcomingTasks.length === 0 ? (
                  <Empty
                    icon="CheckSquare"
                    title="No pending tasks"
                    message="All caught up! Create new tasks to keep your farm organized."
                    actionLabel="Add Task"
                    onAction={() => {/* Navigate to tasks page */}}
                  />
                ) : (
                  upcomingTasks.map((task) => {
                    const farm = farms.find(f => f.Id === parseInt(task.farmId));
                    const crop = crops.find(c => c.Id === parseInt(task.cropId));
                    
                    return (
                      <TaskCard
                        key={task.Id}
                        task={task}
                        farm={farm}
                        crop={crop}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onToggleComplete={handleTaskToggle}
                      />
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Weather Widget */}
          <div>
            <WeatherWidget 
              weatherData={weather}
              loading={false}
              compact={true}
            />
          </div>
        </div>

        {/* Recent Crops */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-display">
              Recent Crops
            </h2>
            <Button size="sm" className="text-sm">
              View All Crops
              <ApperIcon name="ArrowRight" className="w-4 h-4" />
            </Button>
          </div>

          {recentCrops.length === 0 ? (
            <Empty
              icon="Wheat"
              title="No crops planted"
              message="Start tracking your crops by adding your first planting."
              actionLabel="Add Crop"
              onAction={() => {/* Navigate to crops page */}}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentCrops.map((crop) => {
                const farm = farms.find(f => f.Id === parseInt(crop.farmId));
                const plantingDate = new Date(crop.plantingDate);
                const harvestDate = new Date(crop.expectedHarvest);
                const now = new Date();
                const totalDays = differenceInDays(harvestDate, plantingDate);
                const daysPassed = differenceInDays(now, plantingDate);
                const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);

                return (
                  <div
                    key={crop.Id}
                    className="p-4 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg border border-secondary-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                        <p className="text-sm text-gray-600">{crop.variety}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-secondary-700">
                          {Math.round(progress)}%
                        </p>
                        <p className="text-xs text-gray-500">{crop.growthStage}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="MapPin" className="w-3 h-3" />
                        <span>{farm?.name || "Unknown Farm"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" className="w-3 h-3" />
                        <span>{format(plantingDate, "MMM dd")}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="primary" size="lg" className="p-6 h-auto">
            <div className="text-center">
              <ApperIcon name="Plus" className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Add Farm</div>
              <div className="text-sm opacity-90">Create a new farm</div>
            </div>
          </Button>

          <Button variant="secondary" size="lg" className="p-6 h-auto">
            <div className="text-center">
              <ApperIcon name="Wheat" className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Plant Crop</div>
              <div className="text-sm opacity-90">Log new planting</div>
            </div>
          </Button>

          <Button variant="accent" size="lg" className="p-6 h-auto">
            <div className="text-center">
              <ApperIcon name="CheckSquare" className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Add Task</div>
              <div className="text-sm opacity-90">Schedule activity</div>
            </div>
          </Button>

          <Button variant="outline" size="lg" className="p-6 h-auto">
            <div className="text-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Log Transaction</div>
              <div className="text-sm opacity-90">Record income/expense</div>
            </div>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;