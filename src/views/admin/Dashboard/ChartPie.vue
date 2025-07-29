<template>
  <ChartContainer title="Users">
    <div style="display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;">
      <VueApexCharts style="width: 100%;" :options="chartOptions_pie" :series="series_pie" />
    </div>
  </ChartContainer>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import ChartContainer from './ChartContainer.vue';

const series_pie = [44, 55, 13, 43, 22];
const chartOptions_pie = {
  chart: {
    width: 100,
    type: 'pie',
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}

</script>