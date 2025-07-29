<template>
  <ChartContainer>
    <div style="width: 100%;display: flex;justify-content: center;">
      <VueApexCharts style="width: 70%; height: 100%;" :options="chartOptions" :series="series" />
    </div>
  </ChartContainer>
</template>

<script setup>
import ChartContainer from './ChartContainer.vue';
import VueApexCharts from 'vue3-apexcharts';

const chartOptions = {
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
};

const series = [
  {
    name: "series-1",
    data: [30, 40, 35, 50, 49, 60, 70, 91],
  },
];
</script>