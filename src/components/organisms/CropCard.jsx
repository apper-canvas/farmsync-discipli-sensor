import React from "react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressRing from "@/components/molecules/ProgressRing";
import ApperIcon from "@/components/ApperIcon";

const CropCard = ({ crop, farm, onEdit, onDelete }) => {
  const plantingDate = new Date(crop.plantingDate);
  const harvestDate = new Date(crop.expectedHarvest);
  const now = new Date();
  
  const totalDays = differenceInDays(harvestDate, plantingDate);
  const daysPassed = differenceInDays(now, plantingDate);
  const daysRemaining = differenceInDays(harvestDate, now);
  const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);

  const getStageColor = (stage) => {
    const stages = {
      "Planted": "default",
      "Germination": "warning",
      "Growing": "secondary",
      "Flowering": "accent",
      "Maturing": "primary",
      "Ready": "success"
    };
    return stages[stage] || "default";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:scale-[1.02] transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <ProgressRing 
                progress={progress} 
                size={50} 
                strokeWidth={4}
                color="secondary"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-display">
                  {crop.name}
                </h3>
                <p className="text-sm text-gray-600">{crop.variety}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {farm?.name || "Unknown Farm"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(crop)}
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(crop)}
              className="text-error hover:text-error hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Badge variant={getStageColor(crop.growthStage)}>
            {crop.growthStage}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <p className="text-gray-600">Planted</p>
            <p className="font-semibold text-gray-900">
              {format(plantingDate, "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Expected Harvest</p>
            <p className="font-semibold text-gray-900">
              {format(harvestDate, "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {daysRemaining > 0 ? `${daysRemaining} days to harvest` : "Ready for harvest"}
            </span>
          </div>
          
          {crop.area && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Maximize2" className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{crop.area} acres</span>
            </div>
          )}
        </div>

        {crop.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">{crop.notes}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default CropCard;