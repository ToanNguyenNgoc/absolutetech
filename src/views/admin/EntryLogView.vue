<template>
    <div class="users-page">
        <div class="current-menu">Entry Logs</div>
        <div class="toolbar">
            <div class="button-group">

            </div>
        </div>

        <EntrylogTableComponent ref="entryLogRef" />


    </div>
</template>

<script>
import EntrylogTableComponent from '@/components/entry/EntrylogTableComponent.vue';
import { ref } from 'vue';

export default {
    name: 'EntryLogView',
    components: { EntrylogTableComponent },
    setup() {

        const entryLogRef = ref(null);

        return {
            entryLogRef,
        };
    },
};
</script>

<style scoped>
.users-page {
    padding: 16px;
    border-radius: 4px;
}

.toolbar {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.button-group {
    display: flex;
    gap: 16px;
}

.btn {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid transparent;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    background-color: #fff;
}

.btn-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
}

.btn-primary {
    color: #fff;
    background-color: #0080F6;
}

.btn-outlined {
    background-color: #fff;
    border: 1px solid #0080F6;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-outlined:hover {
    background-color: #f0f8ff;
}

.current-menu {
    display: none;
}

@media (max-width: 1024px) {
    .current-menu {
        display: block;
        text-align: center;
        padding: 24px 0;
    }
}

@media (max-width: 767px) {
    .current-menu {
        display: block;
        text-align: center;
        padding: 24px 0;
    }
}
</style>