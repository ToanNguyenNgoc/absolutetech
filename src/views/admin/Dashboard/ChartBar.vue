<template>
  <ChartContainer title="Chart Bar">
    <div style="display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;">
      <VueApexCharts style="width: 80%;" :options="chartOptions" :series="series" />
    </div>
  </ChartContainer>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import ChartContainer from './ChartContainer.vue';

const series = [{
  data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
}];

const chartOptions = {
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
      'United States', 'China', 'Germany'
    ],
  }
};

</script>