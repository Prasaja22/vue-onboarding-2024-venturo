<template>
  <Layout>
    <h1>Sales Chart</h1>
    <div class="row">
      <!-- chart sales -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body">
            <canvas id="sales-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- chart sales by category -->
    </div>
  </Layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";
import Layout from "../../layouts/main";
import { useReportStore } from "../../state/pinia";

const reportCustomerStore = useReportStore();
const salesData = ref([]); // Ref untuk menyimpan data penjualan

// Fungsi untuk mengumpulkan total item per tanggal
const processDataForChart = (data) => {
  const chartData = {};

  data.forEach((sale) => {
    const saleDate = sale.date;
    const totalItems = sale.product_detail.reduce(
      (acc, detail) => acc + detail.total_item,
      0
    );

    if (chartData[saleDate]) {
      chartData[saleDate] += totalItems;
    } else {
      chartData[saleDate] = totalItems;
    }
  });

  return chartData;
};

// Watcher untuk update chart saat salesData berubah
const renderChart = (processedData) => {
  const ctx = document.getElementById("sales-chart").getContext("2d");

  new Chart(ctx, {
    type: "bar", // Bisa diganti jadi 'line' untuk chart garis
    data: {
      labels: Object.keys(processedData), // Tanggal sebagai label
      datasets: [
        {
          label: "Total Sales Items",
          data: Object.values(processedData), // Total item per tanggal
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(async () => {
  // Mendapatkan data dari store
  await reportCustomerStore.getReport(); // pastikan async jika method store async
  salesData.value = reportCustomerStore.reportData; // ambil data dari store

  const processedData = processDataForChart(salesData.value); // Proses data untuk chart
  renderChart(processedData); // Render chart
});
</script>
