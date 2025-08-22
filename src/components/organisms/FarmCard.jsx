import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FarmCard = ({ farm, crops, onEdit, onDelete }) => {
  const activeCrops = crops.filter(crop => crop.farmId === farm.Id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:scale-[1.02] transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 font-display mb-1">
              {farm.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <ApperIcon name="MapPin" className="w-4 h-4" />
              {farm.location}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(farm)}
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(farm)}
              className="text-error hover:text-error hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
            <p className="text-sm text-gray-600">Size</p>
            <p className="text-lg font-bold text-primary-700">
              {farm.size} {farm.sizeUnit}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-secondary-50 to-accent-50 rounded-lg">
            <p className="text-sm text-gray-600">Active Crops</p>
            <p className="text-lg font-bold text-secondary-700">
              {activeCrops.length}
            </p>
          </div>
        </div>

        {activeCrops.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Recent Crops</p>
            <div className="flex flex-wrap gap-1">
              {activeCrops.slice(0, 3).map((crop) => (
                <Badge key={crop.Id} variant="secondary">
                  {crop.name}
                </Badge>
              ))}
              {activeCrops.length > 3 && (
                <Badge variant="default">
                  +{activeCrops.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default FarmCard;