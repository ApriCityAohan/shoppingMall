<template>
    <el-drawer v-model="dialogVisible" title="物流信息" size="40%">
        <el-card shadow="never" class="border-0 mb-3">
            <div class="flex items-center">
                <el-image
                    :src="shipData.logo"
                    fit="cover"
                    :lazy="true"
                    class="rounded border"
                    style="width: 60px; height: 60px"
                ></el-image>
                <div class="ml-2 text-sm">
                    <p class="mb-2">物流公司：{{ shipData.typename }}</p>
                    <p>物流单号：{{ shipData.number }}</p>
                </div>
            </div>
        </el-card>
        <el-card shadow="never" class="border-0 border-t mb-3">
            <el-timeline class="ml-[-20px]">
                <el-timeline-item
                    v-for="(item, index) in shipData.list"
                    :key="index"
                    :timestamp="item.time"
                    placement="top"
                >
                    {{ item.status }}
                </el-timeline-item>
            </el-timeline>
        </el-card>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
// eslint-disable-next-line no-unused-vars
import { getOrderShip } from '~/api/order'
import { toast } from '~/utils/util'
const dialogVisible = ref(false)
const shipData = ref({})

const open = id => {
    return getOrderShip(id).then(res => {
        if (res.status !== 0) {
            return toast(res.msg, 'error')
        }
        shipData.value = res.result
        console.log(shipData.value)
        dialogVisible.value = true
    })
}
const close = () => {
    dialogVisible.value = false
}

defineExpose({
    open,
    close
})
</script>

<style scoped></style>
