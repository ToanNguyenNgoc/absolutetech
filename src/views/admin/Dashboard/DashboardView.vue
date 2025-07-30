<template>
  <PageContainer title="Dashboard">
    <div class="parent">
      <div class="div1">
        <ChartLine />
      </div>
      <div class="div2">
        <ChartPie />
      </div>
      <div class="div3">
        <ChartTimesheet />
      </div>
      <div class="div4">
        <ChartBar />
      </div>
      <div class="div5">
        <ChartSpline />
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import ChartBar from './ChartBar.vue';
import ChartLine from './ChartLine.vue';
import ChartPie from './ChartPie.vue';
import ChartTimesheet from './ChartTimesheet.vue';
import ChartSpline from './ChartSpline.vue';
import PageContainer from '@/components/common/PageContainer.vue';
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

@media (max-width: 768px) {
  .parent {
    display: flex;
    flex-direction: column;
    width: 100%;
    aspect-ratio: unset;
  }

  .div1 {
    grid-area: unset;
    height: max-content;
  }

  .div2, .div3 {
    grid-area: unset;
    width: 100%;
    aspect-ratio: 1/1;
  }
}
</style>