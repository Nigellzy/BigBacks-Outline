import { lucide } from "lucide" // Declare the lucide variable
import { Chart } from "@/components/ui/chart" // Import Chart component

// Initialize Lucide icons
lucide.createIcons()

// Sample data for charts
const wasteData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Waste Reduction %",
      data: [45, 55, 65, 70, 80, 85],
      borderColor: "rgb(16, 185, 129)",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      tension: 0.4,
    },
  ],
}

const categoryData = {
  labels: ["Fruits", "Vegetables", "Dairy", "Meat", "Grains"],
  datasets: [
    {
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        "rgba(251, 146, 60, 0.8)",
        "rgba(34, 197, 94, 0.8)",
        "rgba(59, 130, 246, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(234, 179, 8, 0.8)",
      ],
    },
  ],
}

// Initialize charts
document.addEventListener("DOMContentLoaded", () => {
  // Waste reduction trend chart
  const wasteCtx = document.getElementById("wasteChart").getContext("2d")
  new Chart(wasteCtx, {
    type: "line",
    data: wasteData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  })

  // Category breakdown chart
  const categoryCtx = document.getElementById("categoryChart").getContext("2d")
  new Chart(categoryCtx, {
    type: "doughnut",
    data: categoryData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  })
})
