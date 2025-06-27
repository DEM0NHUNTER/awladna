// front_end/src/components/charts/LineChart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import { useLanguage } from "@/context/LanguageContext";

const LineChart: React.FC<{ data: any[], language?: string }> = ({ data, language = "en" }) => {
  const isRTL = language === "ar";
  
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: "Anxiety",
      data: data.map(d => d.anxiety),
      borderColor: useLanguage().theme.primary,
      backgroundColor: `${useLanguage().theme.primary}88`,
      tension: 0.4,
      fill: true
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { ticks: { autoSkip: true, maxTicksLimit: 6 } },
      y: { beginAtZero: true, max: 5 }
    },
    rtl: isRTL,
    animation: {
      x: isRTL ? "left" : "right"
    }
  };

  return <Line data={chartData} options={options} />;
};