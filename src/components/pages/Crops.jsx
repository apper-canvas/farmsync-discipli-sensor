import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import CropCard from "@/components/organisms/CropCard";
import CropForm from "@/components/organisms/CropForm";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [farmFilter, setFarmFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);

  const growthStages = [
    "Planted",
    "Germination",
    "Growing", 
    "Flowering",
    "Maturing",
    "Ready"
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load crops. Please try again.");
      console.error("Crops loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCrop = () => {
    setEditingCrop(null);
    setIsFormOpen(true);
  };

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setIsFormOpen(true);
  };

  const handleDeleteCrop = async (crop) => {
    if (window.confirm(`Are you sure you want to delete ${crop.name}? This action cannot be undone.`)) {
      try {
        await cropService.delete(crop.Id);
        setCrops(prev => prev.filter(c => c.Id !== crop.Id));
        toast.success("Crop deleted successfully");
      } catch (err) {
        console.error("Delete crop error:", err);
        toast.error("Failed to delete crop");
      }
    }
  };

  const handleSubmitCrop = async (cropData) => {
    try {
      if (editingCrop) {
        const updatedCrop = await cropService.update(editingCrop.Id, cropData);
        setCrops(prev => prev.map(c => c.Id === editingCrop.Id ? updatedCrop : c));
        toast.success("Crop updated successfully");
      } else {
        const newCrop = await cropService.create(cropData);
        setCrops(prev => [...prev, newCrop]);
        toast.success("Crop added successfully");
      }
    } catch (err) {
      console.error("Submit crop error:", err);
      toast.error(editingCrop ? "Failed to update crop" : "Failed to add crop");
    }
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFarm = !farmFilter || crop.farmId === farmFilter;
    const matchesStage = !stageFilter || crop.growthStage === stageFilter;
    
    return matchesSearch && matchesFarm && matchesStage;
  });

  if (loading) return (
    <Layout title="Crops" subtitle="Track your planted crops and growth stages">
      <Loading type="cards" />
    </Layout>
  );

  if (error) return (
    <Layout title="Crops" subtitle="Track your planted crops and growth stages">
      <Error message={error} onRetry={loadData} />
    </Layout>
  );

  return (
    <Layout title="Crops" subtitle="Track your planted crops and growth stages">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <SearchBar
              placeholder="Search crops by name or variety..."
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
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-40"
              >
                <option value="">All Stages</option>
                {growthStages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          
          <Button onClick={handleAddCrop}>
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Crop
          </Button>
        </div>

        {/* Active Filters */}
        {(farmFilter || stageFilter) && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {farmFilter && (
              <Badge variant="primary">
                {farms.find(f => f.Id === farmFilter)?.name || "Unknown Farm"}
                <button
                  onClick={() => setFarmFilter("")}
                  className="ml-1 hover:text-primary-800"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {stageFilter && (
              <Badge variant="secondary">
                {stageFilter}
                <button
                  onClick={() => setStageFilter("")}
                  className="ml-1 hover:text-secondary-800"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Crops Grid */}
        {filteredCrops.length === 0 ? (
          crops.length === 0 ? (
            <Empty
              icon="Wheat"
              title="No crops planted yet"
              message="Start tracking your agricultural activities by adding your first crop planting."
              actionLabel="Add Your First Crop"
              onAction={handleAddCrop}
            />
          ) : (
            <Empty
              icon="Search"
              title="No crops found"
              message="No crops match your current filters. Try adjusting your search criteria."
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => {
              const farm = farms.find(f => f.Id === parseInt(crop.farmId));
              
              return (
                <CropCard
                  key={crop.Id}
                  crop={crop}
                  farm={farm}
                  onEdit={handleEditCrop}
                  onDelete={handleDeleteCrop}
                />
              );
            })}
          </div>
        )}

        {/* Crop Form Modal */}
        <CropForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitCrop}
          crop={editingCrop}
          farms={farms}
        />
      </div>
    </Layout>
  );
};

export default Crops;