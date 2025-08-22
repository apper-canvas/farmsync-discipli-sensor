import React from "react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TaskCard = ({ task, farm, crop, onEdit, onDelete, onToggleComplete }) => {
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const daysUntilDue = differenceInDays(dueDate, now);
  
  const getPriorityColor = (priority) => {
    const colors = {
      high: "error",
      medium: "warning", 
      low: "success"
    };
    return colors[priority.toLowerCase()] || "default";
  };

  const getDueDateStatus = () => {
    if (task.completed) return { text: "Completed", color: "text-success" };
    if (daysUntilDue < 0) return { text: `${Math.abs(daysUntilDue)} days overdue`, color: "text-error" };
    if (daysUntilDue === 0) return { text: "Due today", color: "text-warning" };
    if (daysUntilDue === 1) return { text: "Due tomorrow", color: "text-warning" };
    return { text: `Due in ${daysUntilDue} days`, color: "text-gray-600" };
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-4 transition-all duration-200 ${task.completed ? "opacity-75" : "hover:scale-[1.01]"}`}>
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(task)}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? "bg-success border-success text-white"
                : "border-gray-300 hover:border-primary-500"
            }`}
          >
            {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
          </button>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {task.title}
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="p-1 h-6 w-6"
                >
                  <ApperIcon name="Edit2" className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task)}
                  className="p-1 h-6 w-6 text-error hover:text-error hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={getPriorityColor(task.priority)}>
                {task.priority} Priority
              </Badge>
              
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <ApperIcon name="Calendar" className="w-3 h-3" />
                {format(dueDate, "MMM dd, yyyy")}
              </div>
            </div>

            <div className={`text-sm font-medium ${dueDateStatus.color}`}>
              {dueDateStatus.text}
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 mt-2">{task.description}</p>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              {farm && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="MapPin" className="w-3 h-3" />
                  {farm.name}
                </div>
              )}
              {crop && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="Wheat" className="w-3 h-3" />
                  {crop.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;