import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import ApperIcon from "@/components/ApperIcon";

const FarmForm = ({ isOpen, onClose, onSubmit, farm = null }) => {
  const [formData, setFormData] = useState({
    name: farm?.name || "",
    location: farm?.location || "",
    size: farm?.size || "",
    sizeUnit: farm?.sizeUnit || "acres"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Farm name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.size || formData.size <= 0) newErrors.size = "Valid size is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        size: parseFloat(formData.size),
        ...(farm ? { Id: farm.Id } : {})
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      location: "",
      size: "",
      sizeUnit: "acres"
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={farm ? "Edit Farm" : "Add New Farm"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Farm Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          placeholder="Enter farm name"
          required
        />

        <FormField
          label="Location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          error={errors.location}
          placeholder="City, State"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Size"
            type="number"
            value={formData.size}
            onChange={(e) => handleChange("size", e.target.value)}
            error={errors.size}
            placeholder="0"
            min="0"
            step="0.1"
            required
          />

          <FormField
            label="Unit"
            type="select"
            value={formData.sizeUnit}
            onChange={(e) => handleChange("sizeUnit", e.target.value)}
          >
            <option value="acres">Acres</option>
            <option value="hectares">Hectares</option>
            <option value="sq ft">Square Feet</option>
            <option value="sq m">Square Meters</option>
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
            <ApperIcon name={farm ? "Save" : "Plus"} className="w-4 h-4" />
            {farm ? "Update Farm" : "Add Farm"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FarmForm;