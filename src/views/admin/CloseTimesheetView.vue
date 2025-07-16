<template>
  <div class="open-timesheet-view">
    <h1 style="margin-bottom: 16px">Close Timesheets</h1>
    <CloseTimesheetTable />
  </div>
</template>

<script setup>
import CloseTimesheetTable from '@/components/timesheet/CloseTimesheetTable.vue';
</script>

<style scoped>
.open-timesheet-view {
  padding: 32px 24px;
}
</style>
