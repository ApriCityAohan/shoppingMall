<template>
    <el-drawer v-model="drawerVisible" :title="title" size="70%">
        <el-form :model="searchForm" size="small">
            <el-form-item label="">
                <el-radio-group v-model="searchForm.type" size="small">
                    <el-radio-button label="all"> 全部 </el-radio-button>
                    <el-radio-button label="today"> 今天 </el-radio-button>
                    <el-radio-button label="yesterday"> 昨天 </el-radio-button>
                    <el-radio-button label="last7days"> 最近7天 </el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="开始日期">
                <el-date-picker
                    v-model="searchForm.starttime"
                    type="date"
                    placeholder="选择开始时间"
                    style="width: 30%"
                    format="YYYY-MM-DD"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期">
                <el-date-picker
                    v-model="searchForm.endtime"
                    type="date"
                    placeholder="选择结束时间"
                    style="width: 30%"
                    format="YYYY-MM-DD"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="用户类型">
                <el-radio-group v-model="searchForm.level" size="small">
                    <el-radio-button :label="0"> 全部 </el-radio-button>
                    <el-radio-button :label="1"> 一级推广 </el-radio-button>
                    <el-radio-button :label="2"> 二级推广 </el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button @click="handleResetSearch">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <template v-if="type === 'user'">
                <el-table-column label="ID" align="center" prop="id" width="80"> </el-table-column>
                <el-table-column label="头像" width="65">
                    <template #default="{ row }">
                        <el-avatar :size="40" :src="row.avatar">
                            <img
                                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                            />
                        </el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="用户信息" width="200" prop="username"></el-table-column>
                <el-table-column label="推广用户数量" prop="share_num"> </el-table-column>
                <el-table-column label="订单数量" prop="share_order_num"> </el-table-column>
                <el-table-column label="绑定时间" prop="create_time"> </el-table-column>
            </template>
            <template v-else>
                <el-table-column label="订单号">
                    <template #default="{ row }">
                        {{ row.order.no }}
                    </template>
                </el-table-column>
                <el-table-column label="用户名|昵称|手机">
                    <template #default="{ row }">
                        <div v-if="!row.order.user">该用户不存在</div>
                        <div v-else>
                            {{ row.order.user.username }}|{{ row.order.user.nickname }}|{{
                                row.order.user.phone
                            }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="时间" prop="update_time"> </el-table-column>
                <el-table-column label="返佣金额" prop="commission"> </el-table-column>
            </template>
        </el-table>
        <div class="flex justify-center items-center mt-5">
            <el-pagination
                v-model:current-page="currentPage"
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="limit"
                @current-change="getData"
            />
        </div>
    </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getAgentList, getAgentOrderList } from '~/api/distribution.js'
import { initTableData } from '~/utils/useCommon.js'

const props = defineProps({
    type: {
        type: String,
        default: 'user'
    }
})
const title = computed(() => {
    return props.type === 'user' ? '推广人列表' : '推广订单'
})
// 下拉框数据
const userLevelList = ref([])
const { searchForm, tableData, loading, currentPage, total, limit, getData } = initTableData({
    getListFun: (() => {
        return props.type === 'user' ? getAgentList : getAgentOrderList
    })(),
    searchForm: {
        type: 'all',
        starttime: '',
        endtime: '',
        level: 0,
        user_id: 0
    },
    onGetListSuccess: res => {
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
        total.value = res.totalCount
        userLevelList.value = res.user_level
    }
})
const handleResetSearch = () => {
    searchForm.type = 'all'
    searchForm.starttime = ''
    searchForm.endtime = ''
    searchForm.level = 0
    getData()
}
const drawerVisible = ref(false)

const open = id => {
    drawerVisible.value = true
    searchForm.user_id = id
    getData()
}

defineExpose({
    open
})
</script>

<style scoped></style>
