<template>
    <div>
        <!-- 标签栏 -->
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane
                v-for="(item, index) in tabBars"
                :key="index"
                :label="item.name"
                :name="item.key"
            >
            </el-tab-pane>
        </el-tabs>
        <el-card shadow="never">
            <!-- 搜索 -->
            <div class="mb-3">
                <Search :model="searchForm" @search="getData" @reset="handleResetSearch">
                    <SearchItem label="订单编号">
                        <el-input
                            v-model="searchForm.no"
                            placeholder="订单编号"
                            clearable
                        ></el-input>
                    </SearchItem>
                    <template #moreSearch>
                        <SearchItem label="收货人">
                            <el-input v-model="searchForm.name" placeholder="收货人"></el-input>
                        </SearchItem>
                        <SearchItem label="手机号">
                            <el-input v-model="searchForm.phone" placeholder="手机号"></el-input>
                        </SearchItem>
                        <SearchItem label="开始时间">
                            <el-date-picker
                                v-model="searchForm.starttime"
                                type="date"
                                placeholder="开始时间"
                                value-format="YYYY-MM-DD"
                            >
                            </el-date-picker>
                        </SearchItem>
                        <SearchItem label="结束时间">
                            <el-date-picker
                                v-model="searchForm.endtime"
                                type="date"
                                placeholder="结束时间"
                                value-format="YYYY-MM-DD"
                            >
                            </el-date-picker>
                        </SearchItem>
                    </template>
                </Search>
            </div>
            <ListHeader layout="refresh,download" @refresh="getData" @download="handleExportExcel">
                <el-button
                    v-if="searchForm.tab !== 'delete'"
                    type="danger"
                    size="small"
                    @click="handleMultiDelete"
                    >批量删除</el-button
                >
            </ListHeader>
            <el-table
                ref="multipleTableRef"
                v-loading="loading"
                :data="tableData"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品">
                    <template #default="{ row }">
                        <div class="flex">
                            <div class="flex-1">
                                <p>订单号：</p>
                                <small>{{ row.no }}</small>
                            </div>
                            <div class="flex-1">
                                <p>下单时间：</p>
                                <small>{{ row.create_time }}</small>
                            </div>
                        </div>
                        <template v-for="(item, index) in row.order_items" :key="index">
                            <div class="flex items-center py-2">
                                <el-image
                                    :src="item.goods_item ? item.goods_item.cover : ''"
                                    fit="cover"
                                    :lazy="true"
                                    style="height: 30px; width: 30px"
                                    class="mr-3 rounded"
                                ></el-image>
                                <p class="text-blue-500">
                                    {{ item.goods_item?.title ?? '商品已被删除' }}
                                </p>
                            </div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="实付款" width="120" align="center" prop="total_price" />
                <el-table-column label="买家" width="100" align="center">
                    <template #default="{ row }">
                        <p>{{ row.user.username }}</p>
                        <small>(用户ID：{{ row.user.id }})</small>
                    </template>
                </el-table-column>
                <el-table-column label="交易状态" width="170">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            付款状态:
                            <el-tag
                                v-if="row.payment_method === 'wechat'"
                                type="success"
                                size="small"
                                >微信支付</el-tag
                            >
                            <el-tag v-else-if="row.payment_method === 'alipay'" size="small">
                                支付宝支付
                            </el-tag>
                            <el-tag v-else type="info" size="small">未支付</el-tag>
                        </div>
                        <div class="flex items-center">
                            发货状态:
                            <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{
                                row.ship_data ? '已发货' : '未发货'
                            }}</el-tag>
                        </div>
                        <div class="flex items-center">
                            收货状态:
                            <el-tag
                                :type="row.ship_status === 'received' ? 'success' : 'info'"
                                size="small"
                            >
                                {{ row.ship_status === 'received' ? '已收货' : '未收货' }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="right">
                    <template #default="{ row }">
                        <el-button
                            text
                            type="primary"
                            size="small"
                            class="px-1"
                            @click="handleInfoModel(row)"
                        >
                            订单详情
                        </el-button>
                        <el-button
                            v-if="searchForm.tab === 'noship'"
                            text
                            type="primary"
                            size="small"
                            class="px-1"
                            @click="handleOpen(row)"
                        >
                            订单发货
                        </el-button>
                        <el-button
                            v-if="searchForm.tab === 'refunding'"
                            text
                            type="primary"
                            size="small"
                            class="px-1"
                            @click="handleRefund(row.id, 1)"
                        >
                            同意退款
                        </el-button>
                        <el-button
                            v-if="searchForm.tab === 'refunding'"
                            text
                            type="primary"
                            size="small"
                            class="px-1"
                            @click="handleRefund(row.id, 0)"
                        >
                            拒绝退款
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
        <ExportExcel ref="exportExcelRef" :tabs="tabBars" />
        <InfoModel ref="infoModelRef" :info="info" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getOrderList, deleteOrder, refundOrder } from '~/api/order.js'
import { showToastBox, showPrompt, toast } from '~/utils/util.js'
import ListHeader from '~/components/ListHeader.vue'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'
import ExportExcel from './ExportExcel.vue'
import InfoModel from './InfoModel.vue'
import { initTableData } from '~/utils/useCommon.js'
const {
    searchForm,
    handleResetSearch,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    multipleTableRef,
    handleSelectionChange,
    handleMultiDelete
} = initTableData({
    getListFun: getOrderList,
    searchForm: {
        tab: 'all',
        no: '',
        starttime: '',
        endtime: '',
        name: '',
        phone: null
    },
    onGetListSuccess: res => {
        tableData.value = res.list.map(o => {
            o.bannersLoading = false
            o.contentLoading = false
            o.skuLoading = false
            return o
        })
        total.value = res.totalCount
    },
    delete: deleteOrder
})
// tabBar数据
const tabBars = ref([
    {
        name: '全部',
        key: 'all'
    },
    {
        name: '待支付',
        key: 'nopay'
    },
    {
        name: '待发货',
        key: 'noship'
    },
    {
        name: '待收货',
        key: 'shiped'
    },
    {
        name: '已收货',
        key: 'received'
    },
    {
        name: '已完成',
        key: 'finish'
    },
    {
        name: '已关闭',
        key: 'closed'
    },
    {
        name: '退款中',
        key: 'refunding'
    }
])

const exportExcelRef = ref(null)
const handleExportExcel = () => {
    exportExcelRef.value.open()
}

const infoModelRef = ref(null)
const info = ref({})
const handleInfoModel = row => {
    row.order_items = row.order_items.map(o => {
        if (o.skus_type === 1 && o.goods_skus) {
            const s = []
            for (const k in o.goods_skus.skus) {
                s.push(o.goods_skus.skus[k].value)
            }
            o.sku = s.join(',')
        }
        return o
    })
    info.value = row
    infoModelRef.value.open(row)
}

const handleRefund = (id, agree) => {
    ;(agree ? showToastBox('是否要同意该订单退款?', '') : showPrompt('请输入拒绝的理由')).then(
        ({ value }) => {
            const data = { agree }
            if (!agree) {
                data.disagree_reason = value
            }
            refundOrder(id, data).then(() => {
                getData()
                toast('操作成功')
            })
        }
    )
}
</script>

<style scoped></style>
