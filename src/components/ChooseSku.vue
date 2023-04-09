<template>
    <el-dialog v-model="dialogVisible" title="规格选择" width="80%">
        <el-container style="height: 65vh">
            <el-aside width="220px" class="sku-aside">
                <div class="top">{{ tableData }}</div>
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
                <!-- Main content -->
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
import { ref } from 'vue'
import { getSkuList } from '~/api/skus'
import { initTableData } from '~/utils/useCommon'
const dialogVisible = ref(false)
const { tableData, currentPage, limit, total, getData } = initTableData({ getListFun: getSkuList })
const open = () => {
    getData(1)
    dialogVisible.value = true
}
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
</style>
