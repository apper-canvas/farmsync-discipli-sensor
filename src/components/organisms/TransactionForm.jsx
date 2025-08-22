import React, { useState } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import ApperIcon from "@/components/ApperIcon";

const TransactionForm = ({ isOpen, onClose, onSubmit, transaction = null, farms = [] }) => {
  const [formData, setFormData] = useState({
    type: transaction?.type || "expense",
    farmId: transaction?.farmId || "",
    category: transaction?.category || "",
    amount: transaction?.amount || "",
    date: transaction?.date ? format(new Date(transaction.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    description: transaction?.description || "",
    vendor: transaction?.vendor || ""
  });

  const [errors, setErrors] = useState({});

  const expenseCategories = [
    "Seeds",
    "Fertilizer",
    "Equipment",
    "Labor",
    "Fuel",
    "Maintenance",
    "Utilities",
    "Supplies",
    "Other"
  ];

  const incomeCategories = [
    "Crops",
    "Livestock", 
    "Services",
    "Grants",
    "Rental",
    "Other"
  ];

  const currentCategories = formData.type === "income" ? incomeCategories : expenseCategories;

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reset category if type changes
      if (field === "type" && value !== prev.type) {
        updated.category = "";
      }
      
      return updated;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.farmId) newErrors.farmId = "Farm selection is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Valid amount is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        ...(transaction ? { Id: transaction.Id } : {})
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      type: "expense",
      farmId: "",
      category: "",
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      vendor: ""
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={transaction ? "Edit Transaction" : "Add New Transaction"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Type"
            type="select"
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </FormField>

          <FormField
            label="Farm"
            type="select"
            value={formData.farmId}
            onChange={(e) => handleChange("farmId", e.target.value)}
            error={errors.farmId}
            required
          >
            <option value="">Select a farm</option>
            {farms.map(farm => (
              <option key={farm.Id} value={farm.Id}>
                {farm.name}
              </option>
            ))}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Category"
            type="select"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={errors.category}
            required
          >
            <option value="">Select a category</option>
            {currentCategories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </FormField>

          <FormField
            label="Amount ($)"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            error={errors.amount}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <FormField
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          error={errors.date}
          required
        />

        <FormField
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          placeholder="Brief description of the transaction"
          required
        />

        <FormField
          label="Vendor/Source"
          value={formData.vendor}
          onChange={(e) => handleChange("vendor", e.target.value)}
          placeholder="Company or person involved (optional)"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            <ApperIcon name={transaction ? "Save" : "Plus"} className="w-4 h-4" />
            {transaction ? "Update Transaction" : "Add Transaction"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;