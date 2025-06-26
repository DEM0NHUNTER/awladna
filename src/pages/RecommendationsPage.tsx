import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  priority: string;
  source: string;
  effective_date: string;
  expiration_date?: string;
  type: string;
  extra_data?: string;
  child_id: number;
}

interface RecommendationFormProps {
  initial?: Partial<Recommendation>;
  childId: number;
  onSave: () => void;
  onCancel: () => void;
}

const RecommendationForm: React.FC<RecommendationFormProps> = ({ initial = {}, childId, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [priority, setPriority] = useState(initial.priority || "medium");
  const [type, setType] = useState(initial.type || "behavior");
  const [editingId] = useState(initial.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      priority,
      type,
      source: "ai_model",
      effective_date: new Date().toISOString().split("T")[0],
    };

    if (editingId) {
      await axiosInstance.put(`/api/auth/recommendations/${editingId}`, payload);
    } else {
      await axiosInstance.post(`/api/auth/recommendations`, payload, {
        params: { child_id: childId },
      });
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4 mb-4">
      <h3 className="text-lg font-bold mb-2">{editingId ? "Edit" : "New"} Recommendation</h3>
      <input className="border p-2 w-full mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="border p-2 w-full mb-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <select className="border p-2 w-full mb-2" value={priority} onChange={e => setPriority(e.target.value)}>
        {["critical", "high", "medium", "low"].map(p => <option key={p}>{p}</option>)}
      </select>
      <select className="border p-2 w-full mb-2" value={type} onChange={e => setType(e.target.value)}>
        {["behavior", "emotional"].map(t => <option key={t}>{t}</option>)}
      </select>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

const RecommendationsPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const numericChildId = parseInt(childId || "0", 10);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Recommendation | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/auth/recommendations`, {
        params: { child_id: numericChildId },
      });
      setRecommendations(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this recommendation?")) {
      await axiosInstance.delete(`/api/auth/recommendations/${id}`);
      fetchRecommendations();
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [numericChildId]);

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Recommendations</h1>

      {showForm && (
        <RecommendationForm
          initial={editing || {}}
          childId={numericChildId}
          onSave={() => {
            setEditing(null);
            setShowForm(false);
            fetchRecommendations();
          }}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
        />
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-4 py-2 mb-4 rounded">
          + Add Recommendation
        </button>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : recommendations.length === 0 ? (
        <p>No recommendations yet.</p>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded p-4 shadow bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{rec.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(rec);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{rec.description}</p>
              <p className="text-xs mt-1">Priority: {rec.priority} | Type: {rec.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
