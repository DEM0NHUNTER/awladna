// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChildProfile {
  id: number;
  name: string;
  age: number;
  gender: string;
  behavioral_traits?: string;
  emotional_state?: string;
}

const Profile: React.FC = () => {
  const { user, refreshChildren } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editChild, setEditChild] = useState<ChildProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male",
    behavioral_traits: "",
    emotional_state: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const loadChildren = async () => {
    try {
      const res = await axiosInstance.get("/auth/child/");
      setChildren(res.data);
    } catch (err) {
      console.error("Failed to fetch children:", err);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.age || isNaN(Number(formData.age))) errors.age = "Valid age is required.";
    return errors;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (editChild) {
        await axiosInstance.put(`/auth/child/${editChild.id}`, formData);
        toast.success("Profile updated!");
      } else {
        await axiosInstance.post("/auth/child/", formData);
        toast.success("Profile added!");
      }

      setModalOpen(false);
      setEditChild(null);
      setFormData({
        name: "",
        age: "",
        gender: "male",
        behavioral_traits: "",
        emotional_state: "",
      });
      await loadChildren();
      await refreshChildren();
    } catch (err) {
      toast.error("Something went wrong while saving.");
      console.error("Error saving child:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
      await axiosInstance.delete(`/auth/child/${id}`);
      toast.success("Profile deleted.");
      await loadChildren();
      await refreshChildren();
    } catch (err) {
      toast.error("Delete failed.");
      console.error("Delete failed:", err);
    }
  };

  const openEdit = (child: ChildProfile) => {
    setEditChild(child);
    setFormData({
      name: child.name,
      age: child.age.toString(),
      gender: child.gender,
      behavioral_traits: child.behavioral_traits || "",
      emotional_state: child.emotional_state || "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditChild(null);
    setFormData({
      name: "",
      age: "",
      gender: "male",
      behavioral_traits: "",
      emotional_state: "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Child Profiles</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={18} /> Add New
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {children.length === 0 && <p className="text-sm text-gray-500">No profiles yet.</p>}
          {children.map((child) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <CardTitle>{child.name}</CardTitle>
                  <p className="text-sm">Age: {child.age}</p>
                  <p className="text-sm capitalize">Gender: {child.gender}</p>
                  {child.behavioral_traits && <p className="text-sm">Traits: {child.behavioral_traits}</p>}
                  {child.emotional_state && <p className="text-sm">Mood: {child.emotional_state}</p>}
                  <div className="mt-3 flex gap-3">
                    <Button variant="outline" onClick={() => openEdit(child)} size="sm">
                      <Pencil size={16} /> Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(child.id)} size="sm">
                      <Trash size={16} /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editChild ? "Edit Child Profile" : "Add New Profile"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input name="name" value={formData.name} onChange={handleFormChange} />
              {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <Label>Age</Label>
              <Input name="age" type="number" value={formData.age} onChange={handleFormChange} />
              {formErrors.age && <p className="text-sm text-red-500 mt-1">{formErrors.age}</p>}
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={handleGenderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Behavioral Traits</Label>
              <Input name="behavioral_traits" value={formData.behavioral_traits} onChange={handleFormChange} />
            </div>
            <div>
              <Label>Emotional State</Label>
              <Input name="emotional_state" value={formData.emotional_state} onChange={handleFormChange} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
// This code defines a Profile page where users can manage child profiles.