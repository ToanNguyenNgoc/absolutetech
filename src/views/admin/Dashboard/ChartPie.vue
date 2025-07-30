<template>
  <ChartContainer title="Users">
    <div class="chart-wrapper">
      <VueApexCharts
        :options="chartOptions_pie"
        :series="series_pie"
        type="pie"
      />
    </div>
  </ChartContainer>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import ChartContainer from './ChartContainer.vue';
import { useQuery } from '@tanstack/vue-query';
import { StatisticApi } from '@/api';
import { computed } from 'vue';

const { data } = useQuery({
  queryKey: ['statistic/users'],
  queryFn: () => StatisticApi.users(),
});

const list = computed(() => data.value?.data?.list || []);

const series_pie = computed(() => list.value.map(i => i.user_count));

const chartOptions_pie = computed(() => ({
  chart: {
    type: 'pie',
    height: '100%',
  },
  labels: list.value.map(i => i.name),
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' },
      },
    },
  ],
}));
</script>

<style scoped>
.chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.chart-wrapper :deep(.apexcharts-canvas) {
  height: 100% !important;
}
/* .chart-wrapper :deep(.apexcharts-legend-marker){
  width: 8px !important;
  height: 8px !important;
  border-radius: 100% !important;
  margin-right: 4px !important;
} */
.chart-wrapper :deep(.apexcharts-legend-text) {
  font-size: 11px !important;
}

@media (max-width: 768px) {
  .chart-wrapper{
    height: 100%;
  }
}
</style>