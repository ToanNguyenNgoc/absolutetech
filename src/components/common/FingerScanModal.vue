<template>
    <el-dialog :model-value="visible" :key="dialogKey" title="Scanned Finger" :width="dialogWidth" @close="handleClose"
        :close-on-click-modal="true" :show-close="!loading">
        <div class="checkbox-columns" v-loading="loading">
            <div class="checkbox-column">
                <el-checkbox label="Fingerprint1" :checked="has('Fingerprint1',)" @click.stop.prevent="() => { }" />
                <el-checkbox label="Fingerprint2" :checked="has('Fingerprint2',)" @click.stop.prevent="() => { }" />
                <el-checkbox label="Fingerprint3" :checked="has('Fingerprint3',)" @click.stop.prevent="() => { }" />
                <el-checkbox label="Fingerprint4" :checked="has('Fingerprint4',)" @click.stop.prevent="() => { }" />
                <el-checkbox label="Fingerprint5" :checked="has('Fingerprint5',)" @click.stop.prevent="() => { }" />
            </div>
            <div class="checkbox-column">
                <el-checkbox label="Fingerprint6" :checked="has('Fingerprint6',)" @click.stop.prevent="() => { }" />
                <el-checkbox label="Fingerprint7" :checked="has('Fingerprint7',)" @click.stop.prevent="() => { }" />
                <el-checkbox label="Fingerprint8" :checked="has('Fingerprint8',)" @click.stop.prevent="() => { }" />
                <el-checkbox label="Fingerprint9" :checked="has('Fingerprint9',)" @click.stop.prevent="() => { }" />
                <el-checkbox label="Fingerprint10" :checked="has('Fingerprint10',)" @click.stop.prevent="() => { }" />
            </div>
        </div>
    </el-dialog>
    <MyMessage :message="messageText" :type="messageType" />
</template>

<script>
// import { createFinger } from '@/api/finger'
import { computed, onMounted, ref } from 'vue'
import MyMessage from './MyMessage.vue' // 🔥 Import MyMessage

export default {
    name: 'FingerScanModal',
    components: { MyMessage }, // 🔥 Đăng ký component
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        scannedFingers: {
            type: Array,
            default: () => []
        },
        userId: {
            type: String,
            required: true
        }
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
        const loading = ref(false) // Loading toàn bộ modal
        const isMobile = ref(false)
        const messageText = ref('');
        const messageType = ref('success');
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

        const fingerMapping = {
            1: 'Fingerprint1',
            2: 'Fingerprint2',
            3: 'Fingerprint3',
            4: 'Fingerprint4',
            5: 'Fingerprint5',
            6: 'Fingerprint6',
            7: 'Fingerprint7',
            8: 'Fingerprint8',
            9: 'Fingerprint9',
            10: 'Fingerprint10',
        }

        const standardizedScannedFingers = computed(() => {
            console.log('scannedFingers:', props.scannedFingers)
            return props.scannedFingers.reduce((acc, finger) => {
                if (
                    finger &&
                    finger.no &&
                    finger.finger_data &&
                    fingerMapping[finger.no]
                ) {
                    acc.push(fingerMapping[finger.no])
                }
                return acc
            }, [])
        })

        const has = (label) => {
            return standardizedScannedFingers.value.includes(label)
        }

        const dialogKey = computed(() => {
            return props.visible ? Date.now() : 'hidden'
        })

        const logFinger = () => {
            // let fingerNo = null;
            // for (let key in fingerMapping) {
            //     if (fingerMapping[key] === name) {
            //         fingerNo = Number(key);
            //         break;
            //     }
            // }
            // if (fingerNo !== null) {
            //     registerFinger({ fingerNo, employeeNo: props.userId });
            // }
        }

        // const registerFinger = async ({ fingerNo, employeeNo }) => {
        //     messageText.value = '';
        //     messageType.value = '';
        //     loading.value = true // Bật loading modal

        //     try {
        //         await createFinger({ fingerNo, employeeNo })
        //         messageText.value = `Save no.${fingerNo} Successfully`;
        //         messageType.value = 'success';
        //         handleClose()
        //     } catch (error) {
        //         loading.value = false // Tắt loading modal
        //         console.error(error)
        //         messageText.value = 'Save failed. Please try again.';
        //         messageType.value = 'error';
        //     } finally {
        //         loading.value = false // Tắt loading modal dù thành công hay thất bại
        //         handleClose()
        //     }
        // }

        return {
            handleClose,
            has,
            dialogWidth,
            dialogKey,
            logFinger,
            loading,
            messageText,
            messageType,
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

:deep(.el-loading-mask) {
    background-color: rgba(0, 0, 0, 0.3) !important;
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