<template>
    <el-drawer v-model="modelViable" title="订单详情" size="50%">
        <el-card shadow="never" class="mt-3">
            <template #header>
                <b class="text-xm">订单信息</b>
            </template>
            <el-form label-width="80px">
                <el-form-item label="订单号">
                    {{ info.no }}
                </el-form-item>
                <el-form-item label="付款方式">
                    {{ info.payment_method }}
                </el-form-item>
                <el-form-item label="付款时间">
                    {{ paidTime }}
                </el-form-item>
                <el-form-item label="创建时间">
                    {{ info.create_time }}
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-if="info.ship_data" shadow="never" class="mt-3">
            <template #header>
                <b class="text-xm">发货信息</b>
            </template>
            <el-form label-width="80px">
                <el-form-item label="物流公司">
                    {{ info.ship_data.express_company }}
                </el-form-item>
                <el-form-item label="运单号">
                    {{ info.ship_data.express_no }}
                </el-form-item>
                <el-form-item label="发货时间">
                    {{ shipTime }}
                </el-form-item>
            </el-form>
        </el-card>
        <el-card shadow="never" class="mt-3">
            <template #header>
                <b class="text-xm">订单信息</b>
            </template>
            <div v-for="(item, index) in info.order_items" :key="index" class="flex mb-2">
                <el-image
                    :src="item.goods_item?.cover ?? ''"
                    fit="cover"
                    :lazy="true"
                    style="width: 60px; height: 60px"
                    class="rounded mr-2"
                ></el-image>
                <div class="text-sm">
                    <p class="mt-1">{{ item.goods_item?.title ?? '商品已删除' }}</p>
                    <div v-if="item.sku" class="mt-1">
                        <el-tag type="info" size="small">{{ item.sku }}</el-tag>
                    </div>
                    <div class="mt-1">
                        <b class="mr-2 text-rose-500">￥{{ item.price }}</b>
                        <span class="text-xs text-gray-500">x {{ item.num }}</span>
                    </div>
                </div>
            </div>
            <el-form label-width="80px">
                <el-form-item label="成交价">
                    <span class="text-rose-500 font-bold text-sm">￥{{ info.total_price }}</span>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-if="info.address" shadow="never" class="mt-3">
            <template #header>
                <b class="text-xm">收货信息</b>
            </template>
            <el-form label-width="80px">
                <el-form-item label="收货人">
                    {{ info.address.name }}
                </el-form-item>
                <el-form-item label="联系方式">
                    {{ info.address.phone }}
                </el-form-item>
                <el-form-item label="收货地址">
                    {{
                        info.address.province +
                        info.address.city +
                        info.address.district +
                        info.address.address
                    }}
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-if="info.refund_status !== 'pending'" shadow="never" class="mt-3">
            <template #header>
                <b class="text-xm">退款信息</b>
                <el-button text type="primary" disabled class="float-right">{{
                    refundStatus
                }}</el-button>
            </template>
            <el-form label-width="80px">
                <el-form-item label="退款理由">
                    {{ info.extra.refund_reason }}
                </el-form-item>
            </el-form>
        </el-card>
    </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDateFormat } from '@vueuse/core'
const props = defineProps({
    info: {
        type: Object,
        required: true
    }
})
const shipTime = computed(() => {
    if (props.info.ship_data) {
        const s = useDateFormat(props.info.ship_data.express_time * 1000, 'YYYY-MM-DD HH:mm:ss')
        return s.value
    }
    return ''
})
const refundStatus = computed(() => {
    const status = {
        pending: '待处理',
        applied: '已申请,等待商家处理',
        processing: '退款中',
        success: '退款成功',
        failed: '退款失败'
    }
    return props.info.refund_status ? status[props.info.refund_status] : ''
})

const paidTime = computed(() => {
    const s = useDateFormat(props.info.paid_time * 1000, 'YYYY-MM-DD HH:mm:ss')
    return s.value
})

const modelViable = ref(false)

const open = () => (modelViable.value = true)
const close = () => (modelViable.value = false)

defineExpose({
    open,
    close
})
</script>

<style scoped></style>
