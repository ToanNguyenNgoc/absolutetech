<template>
  <ChartContainer title="Timesheets">
    <div class="chart-wrapper">
      <VueApexCharts :options="chartOptions" :series="series" type="donut" />
    </div>
  </ChartContainer>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import ChartContainer from './ChartContainer.vue';
import { useQuery } from '@tanstack/vue-query';
import { StatisticApi } from '@/api';
import { computed } from 'vue';
import { toUpperCaseFirstText } from '@/utils/common';

const { data } = useQuery({
  queryKey: ['statistic/timesheets'],
  queryFn: () => StatisticApi.timesheets(),
});

const series = computed(() => (data.value?.data?.list || []).map(i => i.timesheet_count || 0))
const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: '100%',
  },
  labels: (data.value?.data?.list || []).map(i => toUpperCaseFirstText(i.status || '')),
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
}));

</script>

<style scoped>
.chart-wrapper {
  height: 100%;
}

.chart-wrapper ::deep(.vue-apexcharts) {
  display: flex;
  justify-content: center;
}
</style>