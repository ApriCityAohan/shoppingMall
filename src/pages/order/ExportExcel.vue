<template>
    <el-drawer v-model="drawerViable" title="导出订单" size="40%">
        <el-form :model="form" label-width="80px" :inline="false">
            <el-form-item label="订单类型">
                <el-select v-model="form.tab" value-key="" placeholder="">
                    <el-option
                        v-for="item in tabs"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker
                    v-model="form.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click="onSubmit">导出</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { toast } from '~/utils/util'
import { exportOrder } from '~/api/order'
defineProps({
    tabs: {
        type: Array,
        default: () => []
    }
})
const form = reactive({
    tab: null,
    time: ''
})
const loading = ref(false)
const drawerViable = ref(false)
const open = () => (drawerViable.value = true)
const close = () => (drawerViable.value = false)

const onSubmit = () => {
    if (!form.tab) return toast('订单类型不能为空', 'error')
    loading.value = true
    let starttime = ''
    let endtime = ''
    if (form.time && Array.isArray(form.time)) {
        starttime = form.time[0]
        endtime = form.time[1]
    }
    exportOrder({
        tab: form.tab,
        starttime,
        endtime
    })
        .then(data => {
            const url = window.URL.createObjectURL(new Blob([data]))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            const filename = new Date().getTime() + '订单列表.xlsx'
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            close()
        })
        .finally(() => {
            loading.value = false
        })
}
defineExpose({
    open,
    close
})
</script>

<style scoped></style>
