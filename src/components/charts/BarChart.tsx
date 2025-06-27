// front_end/src/components/charts/BarChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { useLanguage } from "@/context/LanguageContext";

const BarChart: React.FC<{ data: any[]; language?: string }> = ({ data, language = "en" }) => {
  const { theme } = useLanguage();
  const isRTL = language === "ar";

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Tantrums",
        data: data.map(d => d.tantrums),
        backgroundColor: theme.primary,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 6 },
      },
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
    rtl: isRTL,
    animation: {
      x: {
        from: isRTL ? -100 : 100,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
