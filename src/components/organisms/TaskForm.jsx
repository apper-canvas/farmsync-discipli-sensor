import React, { useState } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import ApperIcon from "@/components/ApperIcon";

const TaskForm = ({ isOpen, onClose, onSubmit, task = null, farms = [], crops = [] }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    farmId: task?.farmId || "",
    cropId: task?.cropId || "",
    dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
    priority: task?.priority || "medium"
  });

  const [errors, setErrors] = useState({});

  const priorities = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  const filteredCrops = crops.filter(crop => 
    !formData.farmId || crop.farmId === formData.farmId
  );

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reset crop selection if farm changes
      if (field === "farmId" && value !== prev.farmId) {
        updated.cropId = "";
      }
      
      return updated;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Task title is required";
    if (!formData.farmId) newErrors.farmId = "Farm selection is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        cropId: formData.cropId || null,
        ...(task ? { Id: task.Id, completed: task.completed } : { completed: false })
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      farmId: "",
      cropId: "",
      dueDate: "",
      priority: "medium"
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={task ? "Edit Task" : "Add New Task"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Task Title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          placeholder="e.g., Water crops, Apply fertilizer"
          required
        />

        <FormField
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Additional details about this task"
          rows={3}
        />

<div className="grid grid-cols-2 gap-4">
          <FormField
            label="Farm"
            type="radiogroup"
            value={formData.farmId}
            onChange={(value) => handleChange("farmId", value)}
            error={errors.farmId}
            required
            name="farmId"
            options={farms.map(farm => ({
              value: farm.Id,
              label: farm.name
            }))}
          />

          <FormField
            label="Crop (Optional)"
            type="select"
            value={formData.cropId}
            onChange={(e) => handleChange("cropId", e.target.value)}
          >
            <option value="">No specific crop</option>
            {filteredCrops.map(crop => (
              <option key={crop.Id} value={crop.Id}>
                {crop.name} {crop.variety && `(${crop.variety})`}
              </option>
            ))}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            error={errors.dueDate}
            required
          />

          <FormField
            label="Priority"
            type="select"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            <ApperIcon name={task ? "Save" : "Plus"} className="w-4 h-4" />
            {task ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;