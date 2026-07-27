import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from "chart.js";

// Register Chart.js components for Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
);

export interface LineChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
  hidden?: boolean; // Set to true to hide by default
  pointRadius?: number;
  pointHoverRadius?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointBorderWidth?: number;
  pointHoverBackgroundColor?: string;
  pointHoverBorderColor?: string;
}

interface LineChartProps {
  labels: string[];
  datasets: LineChartDataset[];
}

export default function LineChart({ labels, datasets }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Process datasets to ensure points are solid filled and not clipped at 0 or 100
    const processedDatasets = datasets.map((ds) => ({
      ...ds,
      clip: false as const,
      // Use solid color (ds.borderColor) for point background instead of transparent area backgroundColor
      pointBackgroundColor: ds.pointBackgroundColor || ds.borderColor,
      pointBorderColor: ds.pointBorderColor || ds.borderColor,
      pointBorderWidth: ds.pointBorderWidth ?? 2,
      pointHoverBackgroundColor: ds.pointHoverBackgroundColor || ds.borderColor,
      pointHoverBorderColor: ds.pointHoverBorderColor || "#ffffff",
      pointRadius: ds.pointRadius ?? 4,
      pointHoverRadius: ds.pointHoverRadius ?? 6,
    }));

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data: {
        labels,
        datasets: processedDatasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        clip: false as const, // Prevent clipping elements at canvas edges
        layout: {
          padding: {
            top: 12,
            bottom: 12,
            left: 8,
            right: 12,
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#cbd5e1", // slate-300
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: "circle",
              font: {
                family: "Inter, sans-serif",
                size: 13,
                weight: 500,
              },
              padding: 15,
              generateLabels: (chart) => {
                const defaultGenerator =
                  ChartJS.defaults.plugins.legend.labels.generateLabels;
                const labels = defaultGenerator(chart);

                return labels.map((label) => {
                  const datasetIndex = label.datasetIndex;
                  if (datasetIndex === undefined || datasetIndex === null)
                    return label;

                  const isVisible = chart.isDatasetVisible(datasetIndex);

                  if (!isVisible) {
                    // Turn hidden to false to prevent line-through/strike-through
                    label.hidden = false;

                    // Dim the text color for hidden items
                    label.fontColor = "rgba(203, 213, 225, 0.25)";
                    (label as any).color = "rgba(203, 213, 225, 0.25)";

                    const dimHexRgb = (
                      colorStr: string | undefined,
                    ): string => {
                      if (!colorStr) return "rgba(255, 255, 255, 0.15)";
                      if (colorStr.startsWith("#")) {
                        const r = parseInt(colorStr.slice(1, 3), 16);
                        const g = parseInt(colorStr.slice(3, 5), 16);
                        const b = parseInt(colorStr.slice(5, 7), 16);
                        return `rgba(${r}, ${g}, ${b}, 0.2)`;
                      }
                      if (colorStr.startsWith("rgb")) {
                        if (colorStr.startsWith("rgba")) {
                          return colorStr.replace(
                            /,?\s*[\d.]+\s*\)$/,
                            ", 0.2)",
                          );
                        }
                        return colorStr
                          .replace("rgb", "rgba")
                          .replace(")", ", 0.2)");
                      }
                      return colorStr;
                    };

                    if (typeof label.fillStyle === "string") {
                      label.fillStyle = dimHexRgb(label.fillStyle);
                    }
                    if (typeof label.strokeStyle === "string") {
                      label.strokeStyle = dimHexRgb(label.strokeStyle);
                    }
                  } else {
                    // Visible item: keep bright color
                    label.fontColor = "#cbd5e1";
                    (label as any).color = "#cbd5e1";
                  }
                  return label;
                });
              },
            },
          },
          tooltip: {
            backgroundColor: "#030014",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "rgba(139, 92, 246, 0.3)",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            titleFont: {
              family: "Inter, sans-serif",
              weight: "bold",
              size: 13,
            },
            bodyFont: {
              family: "Inter, sans-serif",
              size: 13,
            },
            boxPadding: 6,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || "";
                const val = context.parsed.y;
                return ` ${label}: ${val}/100`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              color: "#cbd5e1", // bright slate-300
              font: {
                family: "Inter, sans-serif",
                size: 14,
              },
            },
          },
          y: {
            min: 0,
            max: 100,
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              color: "#cbd5e1", // bright slate-300
              font: {
                family: "Inter, sans-serif",
                size: 14,
              },
              stepSize: 20,
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
  }, [labels, datasets]);

  return (
    <div className="relative w-full h-120">
      <canvas ref={canvasRef} />
    </div>
  );
}
