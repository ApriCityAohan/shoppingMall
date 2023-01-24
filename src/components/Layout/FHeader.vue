<template>
    <div class="header">
        <span class="logo">
            <el-icon class="mr-1"><Shop /></el-icon>
            雷雷商城管理平台
        </span>
        <el-icon class="icon-style"><Fold /></el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-style" @click="handleRefresh"><Refresh /></el-icon>
        </el-tooltip>
        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-style" @click="handleFullScreen">
                    <FullScreen v-if="!isFullscreen" />
                    <Close v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="mx-2">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="exitLogin">退出登入</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <Drawer ref="drawerRef" title="修改密码" size="45%" :destroy-on-close="true" @submit="onSubmit">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码" show-password>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input v-model="form.password" placeholder="请输入新密码" show-password>
                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input v-model="form.repassword" placeholder="请确认新密码" show-password>
                </el-input>
            </el-form-item>
        </el-form>
    </Drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Drawer from '../Drawer.vue'
import { logout, updatepassword } from '~/api/manager'
import { showToastBox, toast } from '~/utils/util'
import { useFullscreen } from '@vueuse/core'
import { ArrowDown, Shop, Fold, Refresh, FullScreen, Close } from '@element-plus/icons-vue'

const router = useRouter()
const store = useStore()
const {
    // 全屏状态
    isFullscreen,
    toggle
} = useFullscreen()
const drawerRef = ref(null)

// 表单数据
const form = reactive({
    oldpassword: '',
    password: '',
    repassword: ''
})
// 表单验证规则
const rules = reactive({
    oldpassword: [
        {
            required: true,
            message: '请输入旧密码',
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
    ],
    repassword: [
        {
            required: true,
            message: '请确认密码',
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
// 刷新页面
const handleRefresh = () => {
    location.reload()
}
// 全屏
const handleFullScreen = () => {
    toggle()
}
// 下拉框内部选项事件
const handleCommand = command => {
    switch (command) {
        case 'rePassword':
            // console.log('修改密码')
            drawerRef.value.open()
            break
        case 'exitLogin':
            showToastBox('是否要退出登入', '警告！')
                .then(() => {
                    logout().then(() => {
                        store.dispatch('logout')
                        toast('退出登入成功')
                        router.push('/login')
                    })
                })
                .catch(() => {
                    console.log('取消退出登入')
                })
            break
        default:
            break
    }
}

const formRef = ref(null)
// 修改密码
const onSubmit = () => {
    formRef.value.validate(valid => {
        if (!valid) {
            return false
        }
        drawerRef.value.loadOn()
        updatepassword(form)
            .then(res => {
                toast('修改密码成功')
                store.dispatch('logout')
                router.replace('/login')
            })
            .finally(() => {
                drawerRef.value.loadOff()
            })
    })
}
</script>

<style scoped>
.header {
    height: 64px;
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
}
.logo {
    width: 250px;
    @apply flex justify-center items-center text-xl font-sans;
}
.icon-style {
    @apply flex justify-center items-center text-xl cursor-pointer hover:bg-indigo-600;
    width: 42px;
    height: 64px;
}
.header .dropdown {
    @apply px-2 flex justify-center items-center cursor-pointer hover:bg-indigo-600;
    width: 100px;
    height: 64px;
}
</style>
