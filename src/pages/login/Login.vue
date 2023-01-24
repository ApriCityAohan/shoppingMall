<template>
    <el-row class="bg-indigo-500 min-h-screen">
        <el-col :lg="16" :md="12" class="title">
            <div class="m-5">
                <div class="tl">欢迎光临</div>
                <div class="tl-msg">
                    欢迎登入雷雷商城管理后台，账号请去内部申请，如有问题请找管理员进行沟通。
                </div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" class="form">
            <h2 class="from-title">欢迎回来</h2>
            <el-divider class="w-[250px]">
                <span class="text-gray-400">账号密码登入</span>
            </el-divider>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="0px" class="w-[250px]">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名">
                        <template #prefix>
                            <el-icon><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码" show-password>
                        <template #prefix>
                            <el-icon><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="w-[250px]"
                        round
                        color="#626aef"
                        type="primary"
                        :loading="loading"
                        @click="submit"
                        >登入</el-button
                    >
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { toast } from '~/utils/util'
const form = reactive({
    username: '',
    password: ''
})
const rules = reactive({
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
        },
        {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur'
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        },
        {
            min: 5,
            max: 23,
            message: '长度在 5 到 23 个字符',
            trigger: 'blur'
        }
    ]
})
const formRef = ref(null)
const router = useRouter()
const store = useStore()
const loading = ref(false)
const submit = () => {
    formRef.value.validate(valid => {
        if (valid) {
            loading.value = true
            store
                .dispatch('login', form)
                .then(() => {
                    // 提示登入成功
                    toast('登入成功', 'success')
                    // 跳转到首页
                    router.replace('/')
                })
                .finally(() => {
                    loading.value = false
                })
        } else {
            return false
        }
    })
}
function onKeyUp(e) {
    if (e.code === 'Enter') {
        submit()
    }
}
onMounted(() => {
    document.addEventListener('keyup', onKeyUp)
})
onBeforeUnmount(() => {
    document.removeEventListener('keyup', onKeyUp)
})
</script>

<style scoped>
.title {
    @apply flex items-center justify-center;
}
.tl {
    @apply text-5xl text-white text-5xl font-bold mb-4;
}
.tl-msg {
    @apply text-gray-200 text-sm;
}
.form {
    @apply bg-light-50 flex items-center justify-center flex-col;
}
.from-title {
    @apply font-bold text-3xl text-gray-800;
}
</style>
