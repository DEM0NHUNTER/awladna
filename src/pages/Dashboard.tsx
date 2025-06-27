// front_end/src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import LineChart from "@/components/charts/LineChart";
import { useTranslation } from "react-i18next";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
const Dashboard: React.FC = () => {
  const [progressData, setProgressData] = useState<any[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await axiosInstance.get("/api/analytics/progress", {
        params: { language: i18n.language }
      });
      setProgressData(res.data);
    };
    fetchProgress();
  }, []);

  return (
    <div className="dashboard" dir={i18n.dir()}>
      <h2>Child Progress Monitoring</h2>

      {/* Emotional State Trends */}
      <div className="trend-chart">
        <h3>Emotional State Over Time</h3>
        <LineChart
          data={progressData.map(d => ({
            date: d.date,
            anxiety: d.emotional_state.anxiety,
            mood_swings: d.emotional_state.mood_swings
          }))}
        />
      </div>

      {/* Behavioral Patterns */}
      <div className="trend-chart">
        <BarChart data={progressData.map(d => ({
          date: d.date,
          tantrums: d.behavioral_patterns.tantrums,
          social_behavior: d.behavioral_patterns.social_behavior
        }))} />
      </div>
    </div>
  );
};