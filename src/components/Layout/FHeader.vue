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
    <el-drawer v-model="drawer" title="修改密码" size="45%" :close-on-click-modal="false">
        <span>Hi there!</span>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { logout } from '~/api/manager'
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
const drawer = ref(false)

const handleRefresh = () => {
    location.reload()
}
const handleFullScreen = () => {
    toggle()
}
const handleCommand = command => {
    switch (command) {
        case 'rePassword':
            // console.log('修改密码')
            drawer.value = true
            break
        case 'exitLogin':
            showToastBox('是否要退出登入')
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
