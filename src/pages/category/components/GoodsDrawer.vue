<!-- eslint-disable vue/no-unused-vars -->
<template>
    <Drawer ref="drawerRef" confirm-text="关联" @submit="handleCommit">
        <el-table v-loading="tableLoading" :data="tableData" border stripe>
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
                    <el-popconfirm
                        title="是否要删除该关联商品?"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        @confirm="handleDelete(row.id)"
                    >
                        <template #reference>
                            <el-button type="primary" text size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </Drawer>

    <ChooseGoods ref="chooseGoodsRef" />
</template>

<script setup>
import { ref } from 'vue'
import Drawer from '~/components/Drawer.vue'
import ChooseGoods from '~/components/ChooseGoods.vue'
import { getCategoryGoods, deleteCategoryGoods, relationCategoryGoods } from '~/api/category'
import { toast } from '~/utils/util'
const drawerRef = ref(null)
const tableLoading = ref(false)
const categoryID = ref(0)
const tableData = ref([])
const open = item => {
    categoryID.value = item.id
    item.goodsDrawerLoading = true
    getData(categoryID.value)
        .then(res => {
            drawerRef.value.open()
        })
        .finally(() => {
            item.goodsDrawerLoading = false
        })
}

const getData = id => {
    return getCategoryGoods(id).then(res => {
        tableData.value = res
    })
}

const handleDelete = id => {
    console.log(id)
    tableLoading.value = true
    deleteCategoryGoods(id)
        .then(() => {
            toast('删除成功')
            getData(categoryID.value)
        })
        .finally(() => {
            tableLoading.value = false
        })
}

const chooseGoodsRef = ref(null)
const handleCommit = () => {
    chooseGoodsRef.value.open(ids => {
        drawerRef.value.loadOn()
        relationCategoryGoods({
            category_id: categoryID.value,
            goods_ids: ids
        })
            .then(() => {
                toast('关联成功')
                getData(categoryID.value)
            })
            .finally(() => {
                drawerRef.value.loadOff()
            })
    })
}

defineExpose({
    open
})
</script>

<style scoped></style>
