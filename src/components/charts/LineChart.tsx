// front_end/src/components/charts/LineChart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import { useLanguage } from "@/context/LanguageContext";

interface ChartProps {
  data: any[];
  language?: string;
}

const LineChart: React.FC<ChartProps> = ({ data, language = "en" }) => {
  const { theme } = useLanguage();
  const isRTL = language === "ar";

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Anxiety",
        data: data.map(d => d.anxiety),
        borderColor: theme.primary,
        backgroundColor: `${theme.primary}88`, // Semi-transparent
        tension: 0.4,
        fill: true,
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
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6,
        },
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

  return <Line data={chartData} options={options} />;
};

export default LineChart;
