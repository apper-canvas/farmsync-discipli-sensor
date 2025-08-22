import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import TransactionCard from "@/components/organisms/TransactionCard";
import TransactionForm from "@/components/organisms/TransactionForm";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { transactionService } from "@/services/api/transactionService";
import { toast } from "react-toastify";
import { format, startOfMonth, startOfYear } from "date-fns";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [farmFilter, setFarmFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const tabs = [
    { id: "all", label: "All Transactions", icon: "List" },
    { id: "income", label: "Income", icon: "TrendingUp" },
    { id: "expenses", label: "Expenses", icon: "TrendingDown" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);
      
      setTransactions(transactionsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load financial data. Please try again.");
      console.error("Finance loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = async (transaction) => {
    if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
      try {
        await transactionService.delete(transaction.Id);
        setTransactions(prev => prev.filter(t => t.Id !== transaction.Id));
        toast.success("Transaction deleted successfully");
      } catch (err) {
        console.error("Delete transaction error:", err);
        toast.error("Failed to delete transaction");
      }
    }
  };

  const handleSubmitTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        const updatedTransaction = await transactionService.update(editingTransaction.Id, transactionData);
        setTransactions(prev => prev.map(t => t.Id === editingTransaction.Id ? updatedTransaction : t));
        toast.success("Transaction updated successfully");
      } else {
        const newTransaction = await transactionService.create(transactionData);
        setTransactions(prev => [...prev, newTransaction]);
        toast.success("Transaction added successfully");
      }
    } catch (err) {
      console.error("Submit transaction error:", err);
      toast.error(editingTransaction ? "Failed to update transaction" : "Failed to add transaction");
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || transaction.type === typeFilter;
    const matchesFarm = !farmFilter || transaction.farmId === farmFilter;
    const matchesCategory = !categoryFilter || transaction.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesTab = activeTab === "all" || transaction.type === activeTab;
    
    return matchesSearch && matchesType && matchesFarm && matchesCategory && matchesTab;
  });

  const sortedTransactions = filteredTransactions.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Calculate financial metrics
  const monthStart = startOfMonth(new Date());
  const yearStart = startOfYear(new Date());
  
  const monthlyTransactions = transactions.filter(t => new Date(t.date) >= monthStart);
  const yearlyTransactions = transactions.filter(t => new Date(t.date) >= yearStart);
  
  const monthlyIncome = monthlyTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const monthlyExpenses = monthlyTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const monthlyBalance = monthlyIncome - monthlyExpenses;
  
  const yearlyIncome = yearlyTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const yearlyExpenses = yearlyTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const yearlyBalance = yearlyIncome - yearlyExpenses;

  const categories = [...new Set(transactions.map(t => t.category))];

  if (loading) return (
    <Layout title="Finance" subtitle="Track income and expenses">
      <Loading type="cards" />
    </Layout>
  );

  if (error) return (
    <Layout title="Finance" subtitle="Track income and expenses">
      <Error message={error} onRetry={loadData} />
    </Layout>
  );

  return (
    <Layout title="Finance" subtitle="Track income and expenses">
      <div className="space-y-6">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold text-success">${monthlyIncome.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-error to-red-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingDown" className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Expenses</p>
                <p className="text-2xl font-bold text-error">${monthlyExpenses.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                monthlyBalance >= 0 
                  ? "bg-gradient-to-r from-success to-green-600" 
                  : "bg-gradient-to-r from-error to-red-600"
              }`}>
                <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Balance</p>
                <p className={`text-2xl font-bold ${monthlyBalance >= 0 ? "text-success" : "text-error"}`}>
                  ${monthlyBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                yearlyBalance >= 0 
                  ? "bg-gradient-to-r from-primary-500 to-primary-600" 
                  : "bg-gradient-to-r from-warning to-yellow-600"
              }`}>
                <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Yearly Balance</p>
                <p className={`text-2xl font-bold ${yearlyBalance >= 0 ? "text-primary-600" : "text-warning"}`}>
                  ${yearlyBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ApperIcon name={tab.icon} className="w-4 h-4" />
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <SearchBar
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            
            <div className="flex gap-2">
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-40"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          
          <Button onClick={handleAddTransaction}>
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>

        {/* Active Filters */}
        {(farmFilter || categoryFilter) && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {farmFilter && (
              <Badge variant="primary">
                {farms.find(f => f.Id === farmFilter)?.name}
                <button
                  onClick={() => setFarmFilter("")}
                  className="ml-1 hover:text-primary-800"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {categoryFilter && (
              <Badge variant="secondary">
                {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                <button
                  onClick={() => setCategoryFilter("")}
                  className="ml-1 hover:text-secondary-800"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Transactions List */}
        {sortedTransactions.length === 0 ? (
          transactions.length === 0 ? (
            <Empty
              icon="DollarSign"
              title="No transactions recorded yet"
              message="Start tracking your farm finances by adding your first income or expense transaction."
              actionLabel="Add Your First Transaction"
              onAction={handleAddTransaction}
            />
          ) : (
            <Empty
              icon="Search"
              title="No transactions found"
              message="No transactions match your current filters. Try adjusting your search criteria."
            />
          )
        ) : (
          <div className="space-y-4">
            {sortedTransactions.map((transaction) => {
              const farm = farms.find(f => f.Id === parseInt(transaction.farmId));
              
              return (
                <TransactionCard
                  key={transaction.Id}
                  transaction={transaction}
                  farm={farm}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              );
            })}
          </div>
        )}

        {/* Transaction Form Modal */}
        <TransactionForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitTransaction}
          transaction={editingTransaction}
          farms={farms}
        />
      </div>
    </Layout>
  );
};

export default Finance;