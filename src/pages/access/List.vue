<template>
    <el-card shadow="never">
        <ListHeader @refresh="getData" />
        <el-tree
            v-loading="loading"
            :data="tableData"
            :props="{ label: 'name', children: 'child' }"
            node-key="id"
            :default-expanded-keys="defaultExpandedKeys"
        />
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import ListHeader from '~/components/ListHeader.vue'
// eslint-disable-next-line no-unused-vars
import { getRuleList } from '~/api/rule'
import { initTableData } from '~/utils/useCommon'

const defaultExpandedKeys = ref([])

const { loading, tableData, getData } = initTableData({
    getListFun: getRuleList,
    onGetListSuccess: res => {
        tableData.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
    }
})
</script>

<style scoped></style>
