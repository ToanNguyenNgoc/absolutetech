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
    categories: [1,2,3,4,5,6,7,8,9,10,11,12],
  },
};

const series = [
  {
    name: "series-1",
    data: [42,32,33,24,59,26,71,83,89,101,110,102],
  },
];
</script>