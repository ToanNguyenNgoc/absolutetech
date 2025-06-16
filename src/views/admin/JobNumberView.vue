<template>
    <div class="job-number-page">
        <JobNumberTable />
    </div>
</template>

<script>
import JobNumberTable from '@/components/job-number/JobNumberTable.vue';

export default {
    name: 'JobNumberView',
    components: { JobNumberTable },
};
</script>

<style scoped>
.job-number-page {
    padding: 16px;
    border-radius: 4px;
}
</style>
