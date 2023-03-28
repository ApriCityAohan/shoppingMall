<template>
    <el-card shadow="never">
        <ListHeader @create="handleAdd" @refresh="getData" />
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column label="优惠券名称" width="350">
                <template #default="{ row }">
                    <div
                        class="border border-dashed rounded py-2 px-4"
                        :class="row.statusText === '领取中' ? 'active' : 'inactive'"
                    >
                        <h5 class="font-bold text-sm">{{ row.name }}</h5>
                        <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="statusText" label="状态" align="center" />
            <el-table-column label="优惠" align="center">
                <template #default="{ row }">
                    <span>
                        {{ row.type ? '折扣' : '满减' }}
                        {{ row.type ? row.value + '折' : '￥' + row.value }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量" align="center" />
            <el-table-column prop="used" label="已使用" align="center" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="handleEdit(scope.row)">
                        修改
                    </el-button>
                    <el-popconfirm
                        title="是否要删除公告?"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)"
                    >
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
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
        <Drawer ref="drawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="优惠券名称" prop="name">
                    <el-input
                        v-model="form.name"
                        placeholder="优惠券名称"
                        style="width: 50%"
                    ></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0" border>满减</el-radio>
                        <el-radio :label="1" border>折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value">
                    <el-input v-model="form.value" placeholder="面值" class="w-50">
                        <template #append>{{ form.type ? '折' : '元' }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发行量" prop="total">
                    <el-input-number v-model="form.total" :min="1" :max="10000"> </el-input-number>
                </el-form-item>
                <el-form-item label="最低使用价格" prop="min_price">
                    <el-input v-model="form.min_price" placeholder="优惠券名称" class="w-50">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="1" :max="1000"> </el-input-number>
                </el-form-item>
                <el-form-item label="优惠券名称" prop="name">
                    <el-date-picker
                        v-model="timeRange"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                    />
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input
                        v-model="form.desc"
                        :rows="5"
                        type="textarea"
                        placeholder="描述内容"
                    />
                </el-form-item>
            </el-form>
        </Drawer>
    </el-card>
</template>

<script setup>
import { computed } from 'vue'
import {
    getCouponList,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    updateCouponStatus
} from '~/api/coupon.js'
import Drawer from '~/components/Drawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import { initTableData, initForm } from '~/utils/useCommon.js'
function formatStatus(row) {
    let s = '领取中'
    const start = new Date(row.start_time).getTime()
    const now = new Date().getTime()
    const end = new Date(row.end_time).getTime()
    if (start > now) {
        s = '未开始'
    } else if (end < now) {
        s = '已结束'
    } else if (row.status === 0) {
        s = '已失效'
    }
    return s
}
const { tableData, loading, currentPage, total, limit, getData, handleDelete } = initTableData({
    getListFun: getCouponList,
    delete: deleteCoupon,
    updateStatus: updateCouponStatus,
    onGetListSuccess: res => {
        tableData.value = res.list.map(item => {
            item.statusText = formatStatus(item)
            return item
        })
        total.value = res.totalCount
    }
})
const { drawerRef, formRef, form, rules, drawerTitle, handleAdd, handleEdit, handleSubmit } =
    initForm({
        getData,
        form: {
            name: '',
            type: 0,
            value: 0,
            total: 100,
            min_price: 0,
            start_time: null,
            end_time: null,
            order: 50
        },
        rules: {},
        create: createCoupon,
        update: updateCoupon,
        loading
    })
const timeRange = computed({
    get() {
        return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
    },
    set(val) {
        form.start_time = val[0]
        form.end_time = val[1]
    }
})
</script>

<style scoped>
.active {
    @apply border-rose-200 bg-rose-50 text-red-400;
}
.inactive {
    @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
