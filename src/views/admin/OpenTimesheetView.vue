<template>
  <div class="open-timesheet-view">
    <h1 style="margin-bottom: 16px">Open Timesheets</h1>
    <TimesheetTable />
  </div>
</template>

<script setup>
import TimesheetTable from '@/components/timesheet/TimesheetTable.vue';
</script>

<style scoped>
.open-timesheet-view {
  padding: 32px 24px;
}
</style>
