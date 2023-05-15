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
                            <el-button type="primary" text size="small" @click="openDrawer(row.key)"
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
        <Drawer ref="aliPayDrawer" title="配置" :destroy-on-close="true" @submit="submitSave">
            <el-form v-if="drawerType === 'alipay'" :model="form" label-width="80px">
                <el-form-item label="app_id">
                    <el-input v-model="form.alipay.app_id"></el-input>
                </el-form-item>
                <el-form-item label="公钥">
                    <el-input
                        v-model="form.alipay.ali_public_key"
                        :rows="4"
                        type="textarea"
                    ></el-input>
                </el-form-item>
                <el-form-item label="私钥">
                    <el-input
                        v-model="form.alipay.private_key"
                        :rows="4"
                        type="textarea"
                    ></el-input>
                </el-form-item>
            </el-form>
            <el-form v-if="drawerType === 'wepay'" :model="form" label-width="100px">
                <el-form-item label="公众号 APPID">
                    <el-input v-model="form.wxpay.app_id" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="小程序 APPID">
                    <el-input v-model="form.wxpay.miniapp_id" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="小程序 secret">
                    <el-input v-model="form.wxpay.secret" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="appid">
                    <el-input v-model="form.wxpay.appid" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="商户号">
                    <el-input v-model="form.wxpay.mch_id" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="API 密钥">
                    <el-input v-model="form.wxpay.key" :rows="3" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="cert_client">
                    <el-upload
                        :action="uploadAction"
                        :headers="{ token }"
                        accept=".pem"
                        :limit="1"
                        :on-success="uploadClientSuccess"
                    >
                        <el-button type="primary" size="small">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">
                                {{ form.wxpay.cert_client ? form.wxpay.cert_client : '还未配置' }}
                            </p>
                            <div class="el-upload__tip">例如：apiclient_cert.pem</div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="cert_key">
                    <el-upload
                        :action="uploadAction"
                        :headers="{ token }"
                        accept=".pem"
                        :limit="1"
                        :on-success="uploadKeySuccess"
                    >
                        <el-button type="primary" size="small">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">
                                {{ form.wxpay.cert_client ? form.wxpay.cert_client : '还未配置' }}
                            </p>
                            <div class="el-upload__tip">例如：apiclient_key.pem</div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </Drawer>
    </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getToken } from '~/utils/auth.js'
import { getSysConfig, updateSysConfig, uploadAction } from '~/api/sysconfig.js'
import { toast } from '~/utils/util'
import Drawer from '~/components/Drawer.vue'

const token = getToken()
const activeName = ref('first')
const tableData = ref([
    {
        name: '支付宝支付',
        desc: '该系统支持即时到账接口',
        src: '/alipay.png',
        key: 'alipay'
    },
    {
        name: '微信支付',
        desc: '该系统支持微信网页支付和扫码支付',
        src: '/wepay.png',
        key: 'wepay'
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
const drawerType = ref('alipay')

const getData = () => {
    loading.value = true
    getSysConfig()
        .then(res => {
            for (const k in form) {
                form[k] = res[k]
            }
        })
        .finally(() => {
            loading.value = false
        })
}
getData()

const openDrawer = key => {
    drawerType.value = key
    console.log(drawerType.value)
    aliPayDrawer.value.open()
}
const uploadClientSuccess = (response, uploadFile, uploadFiles) => {
    form.wxpay.cert_client = response.data
}
const uploadKeySuccess = (response, uploadFile, uploadFiles) => {
    form.wxpay.cert_key = response.data
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
