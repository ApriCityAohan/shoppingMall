<!-- eslint-disable vue/no-unused-vars -->
<template>
    <Drawer ref="drawerRef" confirm-text="关联">
        <el-table :data="tableData" border stripe>
            <el-table-column prop="goods_id" label="ID" width="60" />
            <el-table-column label="商品封面" width="180">
                <template #default="{ row }">
                    <el-image
                        :src="row.cover"
                        fit="fill"
                        :lazy="true"
                        style="height: 64px; width: 64px"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="180" />
            <el-table-column label="操作" width="180">
                <template #default="{ row }">
                    <el-button type="primary" text size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </Drawer>
</template>

<script setup>
import { ref } from 'vue'
import Drawer from '~/components/Drawer.vue'
import { getCategoryGoods } from '~/api/category'
const drawerRef = ref(null)

const categoryID = ref(0)
const tableData = ref([])
const open = item => {
    categoryID.value = item.id
    getData(categoryID.value)
    drawerRef.value.open()
}

const getData = id => {
    getCategoryGoods(id).then(res => {
        tableData.value = res
    })
}
defineExpose({
    open
})
</script>

<style scoped></style>
