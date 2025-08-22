import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import FarmCard from "@/components/organisms/FarmCard";
import FarmForm from "@/components/organisms/FarmForm";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);
      
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load farms. Please try again.");
      console.error("Farms loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddFarm = () => {
    setEditingFarm(null);
    setIsFormOpen(true);
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setIsFormOpen(true);
  };

  const handleDeleteFarm = async (farm) => {
    if (window.confirm(`Are you sure you want to delete ${farm.name}? This action cannot be undone.`)) {
      try {
        await farmService.delete(farm.Id);
        setFarms(prev => prev.filter(f => f.Id !== farm.Id));
        toast.success("Farm deleted successfully");
      } catch (err) {
        console.error("Delete farm error:", err);
        toast.error("Failed to delete farm");
      }
    }
  };

  const handleSubmitFarm = async (farmData) => {
    try {
      if (editingFarm) {
        const updatedFarm = await farmService.update(editingFarm.Id, farmData);
        setFarms(prev => prev.map(f => f.Id === editingFarm.Id ? updatedFarm : f));
        toast.success("Farm updated successfully");
      } else {
        const newFarm = await farmService.create(farmData);
        setFarms(prev => [...prev, newFarm]);
        toast.success("Farm added successfully");
      }
    } catch (err) {
      console.error("Submit farm error:", err);
      toast.error(editingFarm ? "Failed to update farm" : "Failed to add farm");
    }
  };

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <Layout title="Farms" subtitle="Manage your farm properties">
      <Loading type="cards" />
    </Layout>
  );

  if (error) return (
    <Layout title="Farms" subtitle="Manage your farm properties">
      <Error message={error} onRetry={loadData} />
    </Layout>
  );

  return (
    <Layout title="Farms" subtitle="Manage your farm properties">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            placeholder="Search farms by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-md"
          />
          
          <Button onClick={handleAddFarm}>
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Farm
          </Button>
        </div>

        {/* Farms Grid */}
        {filteredFarms.length === 0 ? (
          farms.length === 0 ? (
            <Empty
              icon="MapPin"
              title="No farms added yet"
              message="Start by adding your first farm property to begin tracking your agricultural operations."
              actionLabel="Add Your First Farm"
              onAction={handleAddFarm}
            />
          ) : (
            <Empty
              icon="Search"
              title="No farms found"
              message={`No farms match your search for "${searchTerm}". Try a different search term.`}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarms.map((farm) => (
              <FarmCard
                key={farm.Id}
                farm={farm}
                crops={crops}
                onEdit={handleEditFarm}
                onDelete={handleDeleteFarm}
              />
            ))}
          </div>
        )}

        {/* Farm Form Modal */}
        <FarmForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitFarm}
          farm={editingFarm}
        />
      </div>
    </Layout>
  );
};

export default Farms;