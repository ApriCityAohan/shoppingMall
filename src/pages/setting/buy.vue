<template>
    <el-card shadow="never">
        <el-tabs v-model="activeName">
            <el-tab-pane label="支付设置" name="first">
                <el-table :data="tableData" border>
                    <el-table-column label="支付方式">
                        <template #default="{ row }">
                            <div class="flex items-center">
                                <el-image
                                    :src="row.src"
                                    fit="cover"
                                    :lazy="true"
                                    class="rounded mr-2"
                                    style="width: 40px; height: 40px"
                                ></el-image>
                                <div class="flex flex-col">
                                    <h6>{{ row.name }}</h6>
                                    <small class="flex text-gray-500 mt-1">
                                        {{ row.desc }}
                                    </small>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="150">
                        <template #default="{ row }">
                            <el-button type="primary" text size="small" @click="openDrawer(row)"
                                >配置</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="购物设置" name="second">
                <el-form :model="form" label-width="160px">
                    <el-form-item label="未支付订单">
                        <div>
                            <el-input
                                v-model="form.close_order_minute"
                                type="number"
                                style="width: 250px"
                            >
                                <template #append>分钟后自动关闭</template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1"
                                >订单下单未付款，n分钟后自动关闭，设置0不自动关闭</small
                            >
                        </div>
                    </el-form-item>
                    <el-form-item label="已发货订单">
                        <div>
                            <el-input
                                v-model="form.auto_received_day"
                                type="number"
                                style="width: 250px"
                            >
                                <template #append>天后自动确认收货</template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1"
                                >如果在期间未确认收货，系统自动完成收货，设置0不自动收货</small
                            >
                        </div>
                    </el-form-item>
                    <el-form-item label="已完成订单">
                        <div>
                            <el-input
                                v-model="form.after_sale_day"
                                type="number"
                                style="width: 250px"
                            >
                                <template #append>天内允许申请售后</template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1"
                                >订单完成后
                                ，用户在n天内可以发起售后申请，设置0不允许申请售后</small
                            >
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitSave(form)"> 保存 </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <Drawer
            ref="aliPayDrawer"
            title="配置"
            :destroy-on-close="true"
            @submit="submitSave"
        ></Drawer>
    </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
// eslint-disable-next-line no-unused-vars
import { getSysConfig, updateSysConfig } from '~/api/sysconfig.js'
// eslint-disable-next-line no-unused-vars
import { toast } from '~/utils/util'
import Drawer from '~/components/Drawer.vue'

const activeName = ref('first')
const tableData = ref([
    {
        name: '支付宝支付',
        desc: '该系统支持即时到账接口',
        src: '/alipay.png'
    },
    {
        name: '微信支付',
        desc: '该系统支持微信网页支付和扫码支付',
        src: '/wepay.png'
    }
])
// eslint-disable-next-line no-unused-vars
const form = reactive({
    close_order_minute: 0, // 未支付订单自动关闭时间：分钟，0不自动关闭
    auto_received_day: 0, // 已发货订单自动确认时间：天，0不自动收货
    after_sale_day: 0, // 已完成订单允许申请售后：天
    alipay: {
        app_id: '',
        ali_public_key: '',
        private_key: ''
    }, // 支付宝支付配置 { app_id:"", ali_public_key:"", private_key:""}
    wxpay: {
        app_id: '',
        miniapp_id: '',
        secret: '',
        appid: '',
        mch_id: '',
        key: '',
        cert_client: '',
        cert_key: ''
    }
    // 微信支付配置 { app_id:'',
    // 公众号 APPID miniapp_id:'',
    // 小程序 APPID secret:"",
    // 小程序secret appid:'',
    // appid mch_id:'',
    // 商户号 key:'',
    // API 密钥 cert_client:'', cert_key:'' }
})
const loading = ref(false)
const aliPayDrawer = ref(null)

const getData = () => {
    loading.value = true
    getSysConfig()
        .then(res => {})
        .finally(() => {
            loading.value = false
        })
}
getData()

const openDrawer = row => {
    aliPayDrawer.value.open()
}

const submitSave = () => {
    console.log(form)
    loading.value = true
    updateSysConfig({ ...form })
        .then(res => {
            toast('修改成功')
        })
        .finally(() => {
            loading.value = false
        })
}
</script>

<style scoped></style>
