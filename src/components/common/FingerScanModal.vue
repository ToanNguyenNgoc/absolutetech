<template>
    <el-dialog :model-value="visible" title="Scanned Finger" :width="dialogWidth" @close="handleClose">
        <div class="checkbox-columns">
            <div class="checkbox-column">
                <el-checkbox v-for="(finger, index) in leftFingers" :key="index" :label="finger.name"
                    :checked="has(finger.name)" :disabled="!has(finger.name)"
                    @click="logFinger(finger.number, finger.name)" />
            </div>
            <div class="checkbox-column">
                <el-checkbox v-for="(finger, index) in rightFingers" :key="index" :label="finger.name"
                    :checked="has(finger.name)" :disabled="!has(finger.name)"
                    @click="logFinger(finger.number, finger.name)" />
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { createFinger } from '@/api/finger';

export default {
    name: 'FingerScanModal',
    props: {
        visible: { type: Boolean, required: true },
        scannedFingers: { type: Array, default: () => [] },
        userId: { // Nhận userId từ parent component
            type: String,
            required: true
        }
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
        const isMobile = ref(false);
        const dialogWidth = computed(() => isMobile.value ? '343px' : '400px');

        const handleClose = () => emit('update:visible', false);

        function checkMobile() {
            isMobile.value = window.innerWidth < 768;
        }

        onMounted(() => {
            checkMobile();
            window.addEventListener('resize', checkMobile);
        });

        const has = (label) => props.scannedFingers.includes(label);

        const logFinger = (number, name) => {
            console.log(`Finger No: ${number}, Name: ${name}, User ID: ${props.userId}`);
            registerFinger({ fingerNo: number, employeeNo: props.userId });
        };

        const registerFinger = async ({ fingerNo, employeeNo }) => {
            try {

                await createFinger({ fingerNo, employeeNo });
            } catch (error) {
                console.log(error);
            }
        };

        const leftFingers = [
            { number: 1, name: 'Left thumb' },
            { number: 2, name: 'Left index finger' },
            { number: 3, name: 'Left middle finger' },
            { number: 4, name: 'Left ring finger' },
            { number: 5, name: 'Left pinkie' }
        ];

        const rightFingers = [
            { number: 6, name: 'Right thumb' },
            { number: 7, name: 'Right index finger' },
            { number: 8, name: 'Right middle finger' },
            { number: 9, name: 'Right ring finger' },
            { number: 10, name: 'Right pinkie' }
        ];

        return {
            handleClose, has, dialogWidth, logFinger, registerFinger,
            leftFingers, rightFingers
        };
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
