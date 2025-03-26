<template>
    <el-dialog :model-value="visible" title="Scanned Finger" :width="dialogWidth" @close="handleClose">
        <div class="checkbox-columns">
            <div class="checkbox-column">
                <el-checkbox label="Left thumb" :checked="has('Left thumb')" disabled />
                <el-checkbox label="Left index finger" :checked="has('Left index finger')" disabled />
                <el-checkbox label="Left middle finger" :checked="has('Left middle finger')" disabled />
                <el-checkbox label="Left ring finger" :checked="has('Left ring finger')" disabled />
                <el-checkbox label="Left pinkie" :checked="has('Left pinkie')" disabled />
            </div>
            <div class="checkbox-column">
                <el-checkbox label="Right thumb" :checked="has('Right thumb')" disabled />
                <el-checkbox label="Right index finger" :checked="has('Right index finger')" disabled />
                <el-checkbox label="Right middle finger" :checked="has('Right middle finger')" disabled />
                <el-checkbox label="Right ring finger" :checked="has('Right ring finger')" disabled />
                <el-checkbox label="Right pinkie" :checked="has('Right pinkie')" disabled />
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { computed, onMounted, ref } from 'vue'

export default {
    name: 'FingerScanModal',
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        scannedFingers: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
        const isMobile = ref(false)
        const dialogWidth = computed(() => isMobile.value ? '343px' : '400px')
        const handleClose = () => {
            emit('update:visible', false)
        }
        function checkMobile() {
            isMobile.value = window.innerWidth < 768
        }

        onMounted(() => {
            checkMobile()
            window.addEventListener('resize', checkMobile)
        })

        const has = (label) => {
            return props.scannedFingers.includes(label)
        }

        return {
            handleClose,
            has,
            dialogWidth,
        }
    }
}
</script>

<style scoped>
.checkbox-columns {
    display: flex;
    gap: 40px;
    padding: 12px 4px;
}

.checkbox-column {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

:deep(.el-checkbox) {
    font-weight: 400;
    font-size: 15px;
    color: #333;
}

:deep(.el-checkbox__label) {
    padding-left: 8px;
}

:deep(.el-checkbox.is-disabled.is-checked .el-checkbox__inner) {
    background-color: #fff !important;
    border-color: none !important;
    box-shadow: none !important;
}

:deep(.el-checkbox.is-disabled.is-checked .el-checkbox__inner::after) {
    border-color: #409EFF !important;
}

:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
    border-color: #409EFF;
}

@media (max-width: 767px) {
    .checkbox-columns {
        flex-direction: column;
        gap: 0px;
    }

    .checkbox-column {
        width: 100%;
        margin-bottom: 16px;
    }

    .checkbox-columns {
        display: flex;
        gap: 0px;
        padding: 12px 4px;
        flex-wrap: wrap;
    }
}
</style>
