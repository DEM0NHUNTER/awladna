import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  priority: string;
  type: string;
}

const RecommendationPanel: React.FC<{ childId: number }> = ({ childId }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [type, setType] = useState("behavior");

  const fetchRecs = async () => {
    const res = await axiosInstance.get("/api/auth/recommendations", {
      params: { child_id: childId },
    });
    setRecommendations(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axiosInstance.post("/api/auth/recommendations", {
      title,
      description,
      priority,
      type,
      source: "ai_model",
      effective_date: new Date().toISOString().split("T")[0],
    }, {
      params: { child_id: childId },
    });
    setTitle(""); setDescription(""); setFormVisible(false);
    fetchRecs();
  };

  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/api/auth/recommendations/${id}`);
    fetchRecs();
  };

  useEffect(() => {
    fetchRecs();
  }, [childId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recommendations</h2>

      {formVisible ? (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <input className="border p-2 w-full" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="border p-2 w-full" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <select className="border p-2 w-full" value={priority} onChange={e => setPriority(e.target.value)}>
            {["critical", "high", "medium", "low"].map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="border p-2 w-full" value={type} onChange={e => setType(e.target.value)}>
            {["behavior", "emotional"].map(t => <option key={t}>{t}</option>)}
          </select>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button onClick={() => setFormVisible(false)} className="text-gray-600">Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setFormVisible(true)} className="bg-green-600 text-white px-4 py-2 rounded mb-4">
          + Add Recommendation
        </button>
      )}

      {recommendations.length === 0 ? (
        <p className="text-gray-600">No recommendations yet.</p>
      ) : (
        <ul className="space-y-3">
          {recommendations.map((r) => (
            <li key={r.id} className="border p-3 rounded bg-white shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-sm text-gray-600">{r.description}</p>
                  <p className="text-xs text-gray-500">Priority: {r.priority}, Type: {r.type}</p>
                </div>
                <button onClick={() => handleDelete(r.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendationPanel;
