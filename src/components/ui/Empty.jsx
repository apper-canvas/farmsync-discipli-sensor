import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Package", 
  title = "No data found", 
  message = "Get started by adding your first item.",
  actionLabel,
  onAction
}) => {
  return (
    <Card className="p-12 text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{title}</h3>
      <p className="text-gray-600 mb-8">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;