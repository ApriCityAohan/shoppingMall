<template>
    <el-dialog v-model="dialogVisible" title="规格选择" width="80%">
        <el-container style="height: 65vh" class="rounded border">
            <el-aside width="220px" class="sku-aside">
                <div class="top">
                    <div
                        v-for="(item, index) in tableData"
                        :key="index"
                        class="sku-list"
                        :class="{ active: skuId === item.id }"
                        @click="handleClickSkuList(item.id)"
                    >
                        {{ item.name }}
                    </div>
                </div>
                <div class="bottom">
                    <el-pagination
                        v-model:current-page="currentPage"
                        background
                        layout="prev, next"
                        :total="total"
                        :page-size="limit"
                        @current-change="getData"
                    />
                </div>
            </el-aside>
            <el-main>
                <el-checkbox-group v-model="form.list">
                    <el-checkbox v-for="item in list" :key="item" :label="item" border>
                        {{ item }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-main>
        </el-container>

        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getSkuList } from '~/api/skus'
import { initTableData } from '~/utils/useCommon'
const dialogVisible = ref(false)
const { tableData, currentPage, limit, total, getData } = initTableData({
    getListFun: getSkuList,
    onGetListSuccess: res => {
        tableData.value = res.list
        total.value = res.totalCount
        if (tableData.value.length > 0) {
            handleClickSkuList(tableData.value[0].id)
        }
    }
})
// 当前选中的规格id
const skuId = ref(0)
// 打开弹窗
const open = () => {
    getData(1)
    dialogVisible.value = true
}
// sku列表
const list = ref([])
const form = reactive({
    list: []
})
// 点击规格列表
function handleClickSkuList(id) {
    skuId.value = id
    const item = tableData.value.find(item => item.id === id)
    list.value = item.default.split(',')
}
// 提交
const onSubmit = () => {
    dialogVisible.value = false
}
defineExpose({
    open
})
</script>

<style scoped>
.sku-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}
.sku-aside .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;
    overflow: auto;
}
.sku-aside .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    @apply flex justify-center items-center;
}
.sku-list {
    border-bottom: 1px solid #f4f4f4;
    @apply p-3 text-sm text-gray-600 cursor-pointer flex items-center;
}
.sku-list:hover,
.active {
    @apply bg-blue-50;
}
</style>
