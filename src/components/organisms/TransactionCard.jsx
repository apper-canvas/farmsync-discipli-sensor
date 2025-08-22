import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TransactionCard = ({ transaction, farm, onEdit, onDelete }) => {
  const isIncome = transaction.type === "income";
  const amount = parseFloat(transaction.amount);

  const getCategoryIcon = (category, type) => {
    const icons = {
      // Expense categories
      seeds: "Wheat",
      fertilizer: "Beaker",
      equipment: "Wrench",
      labor: "Users",
      fuel: "Fuel",
      maintenance: "Settings",
      utilities: "Zap",
      supplies: "Package",
      other: "MoreHorizontal",
      
      // Income categories
      crops: "Wheat",
      livestock: "Beef",
      services: "HandHeart",
      grants: "Award",
      rental: "Home"
    };
    return icons[category.toLowerCase()] || (type === "income" ? "TrendingUp" : "TrendingDown");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 hover:scale-[1.01] transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isIncome 
                ? "bg-gradient-to-r from-success to-green-600" 
                : "bg-gradient-to-r from-error to-red-600"
            }`}>
              <ApperIcon 
                name={getCategoryIcon(transaction.category, transaction.type)} 
                className="w-5 h-5 text-white" 
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  {transaction.description || `${transaction.category} ${transaction.type}`}
                </h3>
                <Badge variant={isIncome ? "success" : "error"}>
                  {transaction.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Calendar" className="w-3 h-3" />
                  {format(new Date(transaction.date), "MMM dd, yyyy")}
                </div>
                
                {farm && (
                  <div className="flex items-center gap-1">
                    <ApperIcon name="MapPin" className="w-3 h-3" />
                    {farm.name}
                  </div>
                )}
                
                {transaction.vendor && (
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Building2" className="w-3 h-3" />
                    {transaction.vendor}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`text-right ${isIncome ? "text-success" : "text-error"}`}>
              <p className="text-lg font-bold">
                {isIncome ? "+" : "-"}${amount.toLocaleString()}
              </p>
              <p className="text-xs font-medium uppercase">
                {transaction.type}
              </p>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
                className="p-1 h-6 w-6"
              >
                <ApperIcon name="Edit2" className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction)}
                className="p-1 h-6 w-6 text-error hover:text-error hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TransactionCard;