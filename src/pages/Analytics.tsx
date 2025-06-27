// front_end/src/pages/Analytics.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { motion } from "framer-motion";

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [feedbackStream, setFeedbackStream] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    childId: ""
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get("/api/analytics/feedback-analytics");
        setAnalyticsData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchAnalytics();

    // WebSocket for real-time feedback
    const ws = new WebSocket("wss://your-api-url/api/analytics/feedback-stream");
    ws.onmessage = (event) => {
      const newFeedback = JSON.parse(event.data);
      setFeedbackStream(prev => [...prev, newFeedback]);
    };

    return () => ws.close();
  }, []);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams(filters as any);
      const response = await axiosInstance.get(`/api/analytics/export-feedback?${params}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `feedback-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Feedback Analytics</h1>

      {/* Export Controls */}
      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({...filters, startDate: e.target.value})}
          className="px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({...filters, endDate: e.target.value})}
          className="px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white"
        />

        <select
          value={filters.childId}
          onChange={(e) => setFilters({...filters, childId: e.target.value})}
          className="px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white"
        >
          <option value="">All Children</option>
          {/* Populate with child profiles */}
        </select>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">Total Feedback</h3>
          <p className="text-3xl font-bold text-white">{analyticsData.total_feedback}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">Average Rating</h3>
          <p className="text-3xl font-bold text-white">{analyticsData.average_rating}/5</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">Improvement Rate</h3>
          <p className="text-3xl font-bold text-white">~45%</p>
        </div>
      </div>

      {/* Live Feedback Stream */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Live Feedback</h2>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg max-h-64 overflow-y-auto">
          {feedbackStream.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-2 p-2 border-b border-gray-700"
            >
              <p className="text-sm text-gray-400">{item.timestamp}</p>
              <p className="text-white">Rating: {"★".repeat(item.rating)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;