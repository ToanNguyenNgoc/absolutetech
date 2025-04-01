<template>
    <el-dialog :model-value="visible" :key="dialogKey" title="Scanned Finger" :width="dialogWidth" @close="handleClose"
        :close-on-click-modal="false" :show-close="!loading">
        <div class="checkbox-columns" v-loading="loading">
            <div class="checkbox-column">
                <el-checkbox label="Left thumb" @click="logFinger('Left thumb')" :checked="has('Left thumb')"
                    @click.stop.prevent="() => { }" />
                <el-checkbox label="Left index finger" @click="logFinger('Left index finger')"
                    :checked="has('Left index finger')" @click.stop.prevent="() => { }" />
                <el-checkbox label="Left middle finger" @click="logFinger('Left middle finger')"
                    :checked="has('Left middle finger')" @click.stop.prevent="() => { }" />
                <el-checkbox label="Left ring finger" @click="logFinger('Left ring finger')"
                    :checked="has('Left ring finger')" @click.stop.prevent="() => { }" />
                <el-checkbox label="Left pinkie" @click="logFinger('Left pinkie')" :checked="has('Left pinkie')"
                    @click.stop.prevent="() => { }" />
            </div>
            <div class="checkbox-column">
                <el-checkbox label="Right thumb" @click="logFinger('Right thumb')" :checked="has('Right thumb')"
                    @click.stop.prevent="() => { }" />
                <el-checkbox label="Right index finger" @click="logFinger('Right index finger')"
                    :checked="has('Right index finger')" @click.stop.prevent="() => { }" />
                <el-checkbox label="Right middle finger" @click="logFinger('Right middle finger')"
                    :checked="has('Right middle finger')" @click.stop.prevent="() => { }" />
                <el-checkbox label="Right ring finger" @click="logFinger('Right ring finger')"
                    :checked="has('Right ring finger')" @click.stop.prevent="() => { }" />
                <el-checkbox label="Right pinkie" @click="logFinger('Right pinkie')" :checked="has('Right pinkie')"
                    @click.stop.prevent="() => { }" />
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
            1: 'Left thumb',
            2: 'Left index finger',
            3: 'Left middle finger',
            4: 'Left ring finger',
            5: 'Left pinkie',
            6: 'Right thumb',
            7: 'Right index finger',
            8: 'Right middle finger',
            9: 'Right ring finger',
            10: 'Right pinkie'
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