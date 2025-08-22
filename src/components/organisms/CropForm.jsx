import React, { useState } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import ApperIcon from "@/components/ApperIcon";

const CropForm = ({ isOpen, onClose, onSubmit, crop = null, farms = [] }) => {
  const [formData, setFormData] = useState({
    name: crop?.name || "",
    variety: crop?.variety || "",
    farmId: crop?.farmId || "",
    plantingDate: crop?.plantingDate ? format(new Date(crop.plantingDate), "yyyy-MM-dd") : "",
    expectedHarvest: crop?.expectedHarvest ? format(new Date(crop.expectedHarvest), "yyyy-MM-dd") : "",
    growthStage: crop?.growthStage || "Planted",
    area: crop?.area || "",
    notes: crop?.notes || ""
  });

  const [errors, setErrors] = useState({});

  const growthStages = [
    "Planted",
    "Germination", 
    "Growing",
    "Flowering",
    "Maturing",
    "Ready"
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Crop name is required";
    if (!formData.farmId) newErrors.farmId = "Farm selection is required";
    if (!formData.plantingDate) newErrors.plantingDate = "Planting date is required";
    if (!formData.expectedHarvest) newErrors.expectedHarvest = "Expected harvest date is required";
    
    if (formData.plantingDate && formData.expectedHarvest) {
      if (new Date(formData.expectedHarvest) <= new Date(formData.plantingDate)) {
        newErrors.expectedHarvest = "Harvest date must be after planting date";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        area: formData.area ? parseFloat(formData.area) : null,
        ...(crop ? { Id: crop.Id } : {})
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      variety: "",
      farmId: "",
      plantingDate: "",
      expectedHarvest: "",
      growthStage: "Planted",
      area: "",
      notes: ""
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={crop ? "Edit Crop" : "Add New Crop"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Crop Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            placeholder="e.g., Corn, Wheat, Tomatoes"
            required
          />

          <FormField
            label="Variety"
            value={formData.variety}
            onChange={(e) => handleChange("variety", e.target.value)}
            placeholder="e.g., Sweet Corn, Winter Wheat"
          />
        </div>

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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Planting Date"
            type="date"
            value={formData.plantingDate}
            onChange={(e) => handleChange("plantingDate", e.target.value)}
            error={errors.plantingDate}
            required
          />

          <FormField
            label="Expected Harvest"
            type="date"
            value={formData.expectedHarvest}
            onChange={(e) => handleChange("expectedHarvest", e.target.value)}
            error={errors.expectedHarvest}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Growth Stage"
            type="select"
            value={formData.growthStage}
            onChange={(e) => handleChange("growthStage", e.target.value)}
          >
            {growthStages.map(stage => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </FormField>

          <FormField
            label="Area (acres)"
            type="number"
            value={formData.area}
            onChange={(e) => handleChange("area", e.target.value)}
            placeholder="Optional"
            min="0"
            step="0.1"
          />
        </div>

        <FormField
          label="Notes"
          type="textarea"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Additional notes about this crop"
          rows={3}
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
            <ApperIcon name={crop ? "Save" : "Plus"} className="w-4 h-4" />
            {crop ? "Update Crop" : "Add Crop"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CropForm;