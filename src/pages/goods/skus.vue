<template>
    <Drawer ref="drawerRef" destroy-on-close title="设置商品规格" size="70%" @submit="onSubmit">
        <el-form :model="form">
            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :label="0" border>单规格</el-radio>
                    <el-radio :label="1" border>多规格</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="form.sku_type === 0">
                <el-form-item label="市场价格">
                    <el-input v-model="form.sku_value.oprice" type="number" style="width: 35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价格">
                    <el-input v-model="form.sku_value.pprice" type="number" style="width: 35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本价格">
                    <el-input v-model="form.sku_value.cprice" type="number" style="width: 35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.sku_value.weight" type="number" style="width: 35%">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品体积">
                    <el-input v-model="form.sku_value.volume" type="number" style="width: 35%">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>
            <template v-else> 多规格 </template>
        </el-form>
    </Drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Drawer from '~/components/Drawer.vue'
import { readGoods, updateGoodSku } from '~/api/goods'
import { toast } from '~/utils/util'
// 抽屉Ref
const drawerRef = ref(null)
// 表单数据
const form = reactive({
    sku_type: 0, // 规格类型：0单规格1多规格
    sku_value: {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0
    }
})
// 商品id
const goodsId = ref(0)
// 打开抽屉
const open = row => {
    goodsId.value = row.id
    row.skuLoading = true
    readGoods(row.id)
        .then(res => {
            // console.log(res)
            form.sku_type = res.sku_type
            console.log(form.sku_type)
            form.sku_value = res.sku_value || {
                oprice: 0,
                pprice: 0,
                cprice: 0,
                weight: 0,
                volume: 0
            }
            drawerRef.value.open()
        })
        .finally(() => {
            row.skuLoading = false
        })
}
// 提交事件
const emit = defineEmits(['refers'])
// 提交表单
const onSubmit = () => {
    drawerRef.value.loadOn()
    updateGoodSku(goodsId.value, form)
        .then(() => {
            drawerRef.value.close()
            toast('设置商品规格成功')
            emit('refers')
        })
        .finally(() => {
            drawerRef.value.loadOff()
        })
}
// 暴露给父组件的方法
defineExpose({
    open
})
</script>

<style scoped></style>
