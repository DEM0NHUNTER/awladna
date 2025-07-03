// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import ChildProfileForm from "@/components/ChildProfileForm";

interface ChildProfile {
  child_id: number;
  name: string;
  birth_date: string;
  gender: string;
  behavioral_patterns: Record<string, any>;
  emotional_state: Record<string, any>;
}

const Profile: React.FC = () => {
  const { refreshChildren } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editChild, setEditChild] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    gender: "male",
    behavioral_patterns: { mood: "" },
    emotional_state: { status: "" },
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const loadChildren = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/auth/child/");
      setChildren(res.data);
    } catch (err) {
      console.error("Failed to fetch children:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.birth_date) {
      errors.birth_date = "Birth date is required.";
    } else if (new Date(formData.birth_date) > new Date()) {
      errors.birth_date = "Birth date cannot be in the future.";
    }
    if (!formData.behavioral_patterns.mood?.trim()) {
      errors.mood = "Mood is required.";
    }
    if (!formData.emotional_state.status?.trim()) {
      errors.status = "Status is required.";
    }
    return errors;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (field: string, value: string) => {
    const keys = field.split(".");
    if (keys.length === 2) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0] as keyof typeof prev],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        birth_date: formData.birth_date,
        gender: formData.gender,
        behavioral_patterns: formData.behavioral_patterns,
        emotional_state: formData.emotional_state,
      };

      if (editChild) {
        await axiosInstance.put(`/auth/child/${editChild.child_id}`, payload);
        toast.success("Profile updated!");
      } else {
        await axiosInstance.post("/auth/child/", payload);
        toast.success("Profile added!");
      }

      setModalOpen(false);
      setEditChild(null);
      resetForm();
      await loadChildren();
      await refreshChildren();
    } catch (err) {
      toast.error("Something went wrong while saving.");
      console.error("Error saving child:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      birth_date: "",
      gender: "male",
      behavioral_patterns: { mood: "" },
      emotional_state: { status: "" },
    });
    setFormErrors({});
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
      birth_date: child.birth_date,
      gender: child.gender,
      behavioral_patterns: child.behavioral_patterns,
      emotional_state: child.emotional_state,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditChild(null);
    resetForm();
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

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading profiles...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {children.length === 0 && <p className="text-sm text-gray-500">No profiles yet.</p>}
            {children.map((child) => (
              <motion.div
                key={child.child_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <CardTitle>{child.name}</CardTitle>
                    <p className="text-sm">DOB: {child.birth_date}</p>
                    <p className="text-sm capitalize">Gender: {child.gender}</p>
                    <p className="text-sm">Mood: {child.behavioral_patterns?.mood}</p>
                    <p className="text-sm">Status: {child.emotional_state?.status}</p>
                    <div className="mt-3 flex gap-3">
                      <Button variant="outline" onClick={() => openEdit(child)} size="sm">
                        <Pencil size={16} /> Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(child.child_id)} size="sm">
                        <Trash size={16} /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editChild ? "Edit Child Profile" : "Add New Profile"}</DialogTitle>
          </DialogHeader>
          <ChildProfileForm
            formData={formData}
            formErrors={formErrors}
            onChange={handleFormChange}
            onSelectChange={handleSelectChange}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
