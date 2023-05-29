<template>
    <div>
        <panel></panel>
        <el-card shadow="never">
            <div class="mb-3">
                <Search :model="searchForm" @search="getData" @reset="handleResetSearch">
                    <SearchItem label="关键词">
                        <el-radio-group v-model="searchForm.type" size="small">
                            <el-radio-button label="all"> 全部 </el-radio-button>
                            <el-radio-button label="today"> 今天 </el-radio-button>
                            <el-radio-button label="yesterday"> 昨天 </el-radio-button>
                            <el-radio-button label="last7days"> 最近7天 </el-radio-button>
                        </el-radio-group>
                    </SearchItem>
                    <template #moreSearch>
                        <SearchItem label="开始时间">
                            <el-date-picker
                                v-model="searchForm.starttime"
                                type="date"
                                placeholder="选择开始时间"
                                style="width: 90%"
                                format="YYYY-MM-DD"
                            >
                            </el-date-picker>
                        </SearchItem>
                        <SearchItem label="结束时间">
                            <el-date-picker
                                v-model="searchForm.endtime"
                                type="date"
                                placeholder="选择结束时间"
                                style="width: 90%"
                                format="YYYY-MM-DD"
                            >
                            </el-date-picker>
                        </SearchItem>
                        <SearchItem label="关键词">
                            <el-input
                                v-model="searchForm.keyword"
                                placeholder="手机号/邮箱/会员昵称"
                                clearable
                            ></el-input>
                        </SearchItem>
                    </template>
                </Search>
            </div>
            <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
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
                <el-table-column label="用户信息" width="200">
                    <template #default="{ row }">
                        <p class="text-xs font-medium">用户：{{ row.username }}</p>
                        <p class="text-xs font-medium">昵称：{{ row.nickname }}</p>
                        <p class="text-xs font-medium">姓名：{{ row.user_info.name }}</p>
                        <p class="text-xs font-medium">电话：{{ row.phone }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="推广用户数量" prop="share_num"> </el-table-column>
                <el-table-column label="订单数量" prop="share_order_num"> </el-table-column>
                <el-table-column label="订单金额" prop="order_price"> </el-table-column>
                <el-table-column label="账户佣金" prop="commission"> </el-table-column>
                <el-table-column label="已提现金额" prop="cash_out_price"> </el-table-column>
                <el-table-column label="提现次数" prop="cash_out_time"> </el-table-column>
                <el-table-column label="未提现金额" prop="no_cash_out_price"> </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            size="small"
                            text
                            @click="opeDataDrawer(row.id, 'user')"
                        >
                            推广人
                        </el-button>
                        <el-button
                            type="primary"
                            size="small"
                            text
                            @click="opeDataDrawer(row.id, 'order')"
                        >
                            推广订单
                        </el-button>
                    </template>
                </el-table-column>
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
        </el-card>
        <dataDrawer ref="dataDrawerRef"></dataDrawer>
        <dataDrawer ref="dataOrderDrawerRef" type="order"></dataDrawer>
    </div>
</template>

<script setup>
import panel from './panel.vue'
import { ref } from 'vue'
// eslint-disable-next-line no-unused-vars
import { getAgentList } from '~/api/distribution.js'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'
import dataDrawer from './dataDrawer.vue'

import { initTableData } from '~/utils/useCommon.js'

// 下拉框数据
const userLevelList = ref([])
const { searchForm, handleResetSearch, tableData, loading, currentPage, total, limit, getData } =
    initTableData({
        getListFun: getAgentList,
        searchForm: {
            keyword: '',
            type: 'all',
            starttime: '',
            endtime: ''
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

const dataDrawerRef = ref(null)
const dataOrderDrawerRef = ref(null)

const opeDataDrawer = (id, type) => {
    type === 'order' ? dataOrderDrawerRef.value.open(id) : dataDrawerRef.value.open(id)
}
</script>

<style scoped></style>
