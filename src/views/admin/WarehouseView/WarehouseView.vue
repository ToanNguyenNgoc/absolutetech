<template>
    <PageContainer>
        <div class="main-container">
            <h1 class="main-title">Main</h1>

            <div class="menu-grid">
                <!-- <MenuCard title="Issue" icon="🟢" />
            <MenuCard title="Return" icon="🔙" />
            <MenuCard title="Replenish" icon="📦" />
            <MenuCard title="Physical" icon="📝" />
            <MenuCard title="Transactions" icon="📄" />
            <MenuCard title="Notifications" icon="🔔" />
            <MenuCard title="Configure Items / Locations" icon="📦" /> -->
                <MenuCard title="Project Request" icon="🔃" to="/admin/project-request" />
            </div>
        </div>
    </PageContainer>
</template>

<script setup>
import PageContainer from '@/components/common/PageContainer.vue';
import MenuCard from './components/MenuCard.vue';
</script>

<style scoped>
.job-number-page {
    padding: 16px;
    border-radius: 4px;
}

.main-container {
    background-color: #f9fafb;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.main-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
}

.menu-grid {
    display: grid;
    grid-template-columns: repeat(2, 260px);
    gap: 20px;
}

.main-footer {
    margin-top: 60px;
    font-size: 0.75rem;
    color: #888;
}
</style>