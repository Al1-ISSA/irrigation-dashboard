"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartProps = {
  xValues: number[];
  yValues: number[];
  title:string;
};

const MainChart: React.FC<ChartProps> = ({ xValues, yValues , title }) => {
  const data = {
    labels: xValues,
    datasets: [
      {
        label: title,
        data: yValues,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  const options = {
    scales: {
      x: {
        
        label: "date",
        data:xValues,
        time: {
          unit: "day",
        },
      },
    },
  };

  return (
    <>
      <div className="w-full">
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default MainChart;
