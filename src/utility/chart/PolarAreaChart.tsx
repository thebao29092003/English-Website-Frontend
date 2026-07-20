import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PolarAreaController,
  type ChartConfiguration,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PolarAreaController
);

interface PolarAreaChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth?: number;
    }[];
  };
}

export default function PolarAreaChart({ data }: PolarAreaChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const config: ChartConfiguration<"polarArea"> = {
      type: "polarArea",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            grid: {
              color: "rgba(255, 255, 255, 0.08)",
            },
            angleLines: {
              color: "rgba(255, 255, 255, 0.08)",
            },
            pointLabels: {
              display: true,
              centerPointLabels: true,
              color: (context) => {
                const index = context.index;
                const dataset = data.datasets[0];
                return (
                  dataset?.borderColor?.[index] ||
                  dataset?.backgroundColor?.[index] ||
                  "#cbd5e1"
                );
              },
              font: {
                family: "Inter, sans-serif",
                size: 13,
                weight: 600,
              },
            },
            ticks: {
              backdropColor: "transparent",
              color: "#cbd5e1", // bright ticks
              font: {
                size: 13,
              },
              stepSize: 20,
            },
            min: 0,
            max: 100,
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          legend: {
            display: false, // Hidden legend
          },
          tooltip: {
            backgroundColor: "#030014",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "rgba(139, 92, 246, 0.3)",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            titleFont: {
              family: "Inter, sans-serif",
              weight: "bold",
            },
            bodyFont: {
              family: "Inter, sans-serif",
            },
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const label = context.chart.data.labels?.[context.dataIndex] || "";
                const val = context.parsed.r;
                return ` ${label}: ${val}/100`;
              },
            },
          },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
