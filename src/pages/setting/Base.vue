<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form" label-width="160px"> </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
// eslint-disable-next-line no-unused-vars
import { getSysConfig, updateSysConfig } from '~/api/sysconfig'
const form = reactive({
    open_reg: 1, // 开启注册，0关闭1开启
    reg_method: 'username', // 注册方式，username普通phone手机
    password_min: 7, // 密码最小长度
    password_encrypt: '0,1,2', // 密码复杂度，0数字、1小写字母、2大写字母、3符号；例如0,1,2
    upload_method: 'oss', // 上传方式，local本地，oss对象存储
    upload_config: {
        Bucket: '',
        ACCESS_KEY: '',
        SECRET_KEY: '',
        http: ''
    }, // 上传配置 { Bucket:"", ACCESS_KEY:"", SECRET_KEY:"", http:""}
    api_safe: 1, // api安全，0关闭1开启
    api_secret: '' // 秘钥
})
const loading = ref(false)
const getData = () => {
    loading.value = true
    getSysConfig()
        .then(res => {
            console.log(res)
        })
        .finally(() => {
            loading.value = false
        })
}
getData()
</script>

<style scoped></style>
