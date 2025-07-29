<template>
  <h1>Dashboard</h1>
  <!-- <VueApexCharts style="width: 300px;" type="bar" :options="chartOptions" :series="series" /> -->
  <!-- <VueApexCharts style="width: 300px;" :options="chartOptions_pie" :series="series_pie" /> -->
  <div class="parent">
    <div class="div1">
     <ChartLine/>
    </div>
    <div class="div2">
      <ChartPie/>
    </div>
    <div class="div3">
      <ChartContainer>
        
      </ChartContainer>
    </div>
    <div class="div4">
      <ChartBar/>
    </div>
    <div class="div5">
      <ChartContainer>
        
      </ChartContainer>
    </div>
  </div>
</template>

<script setup>
import ChartBar from './ChartBar.vue';
import ChartContainer from './ChartContainer.vue';
import ChartLine from './ChartLine.vue';
import ChartPie from './ChartPie.vue';

// import VueApexCharts from 'vue3-apexcharts';

// const chartOptions = {
//   chart: {
//     id: "vuechart-example",
//   },
//   xaxis: {
//     categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
//   },
// };

// const series = [
//   {
//     name: "series-1",
//     data: [30, 40, 35, 50, 49, 60, 70, 91],
//   },
// ];
// //
// const series_pie = [44, 55, 13, 43, 22];
// const chartOptions_pie = {
//   chart: {
//     width: 100,
//     type: 'pie',
//   },
//   labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
//   responsive: [{
//     breakpoint: 480,
//     options: {
//       chart: {
//         width: 200
//       },
//       legend: {
//         position: 'bottom'
//       }
//     }
//   }]
// };
</script>

<style scoped>
.parent {
  width: 100%;
  aspect-ratio: 12/6;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.div1 {
  grid-area: 1 / 1 / 4 / 7;
}

.div2 {
  grid-area: 1 / 7 / 4 / 10;
}

.div3 {
  grid-area: 1 / 10 / 4 / 13;
}

.div4 {
  grid-area: 4 / 1 / 7 / 6;
}

.div5 {
  grid-area: 4 / 6 / 7 / 13;
}

/* @media (min-width: 768px) {
  .parent{
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
  .div1{
    width: 100%;
    aspect-ratio: 2/1;
  }
  .div2, .div3{
    width: 50%;
    aspect-ratio: 1/1;
  }
} */
</style>