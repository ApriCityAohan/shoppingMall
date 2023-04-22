<template>
    <el-drawer v-model="modelViable" title="订单详情" size="50%">
        <!-- <div class="info-model"></div> -->
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
                    {{ info.paid_time }}
                </el-form-item>
                <el-form-item label="创建时间">
                    {{ info.create_time }}
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
                    <div v-if="item.skus_type === 1 && item.goods_skus" class="mt-1">
                        <el-tag type="info" size="small"> </el-tag>
                    </div>
                    <div class="mt-1">
                        <b class="mr-2 text-rose-500">￥{{ item.price }}</b>
                        <span class="text-xs text-gray-500">x {{ item.num }}</span>
                    </div>
                </div>
            </div>
            <el-form label-width="80px">
                <el-form-item label="成交价">
                    {{ info.total_price }}
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
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    info: {
        type: Object,
        required: true
    }
})

const modelViable = ref(false)

const open = () => (modelViable.value = true)
const close = () => (modelViable.value = false)

defineExpose({
    open,
    close
})
</script>

<style scoped>
/* .info-model {
    position: absolute;
} */
</style>
