<template>
    <el-container>
        <el-header height="">
            <!-- Header content -->
            <f-header></f-header>
        </el-header>
        <el-container>
            <el-aside class="asideMenu" :style="{ width: $store.state.menuWidth }">
                <!-- Aside content -->
                <f-menu></f-menu>
            </el-aside>
            <el-main>
                <!-- Main content -->
                <tab-list></tab-list>
                <router-view v-slot="{ Component }">
                    <transition name="fade">
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from '~/components/Layout/FHeader.vue'
import FMenu from '~/components/Layout/FMenu.vue'
import TabList from '~/components/Layout/TabList.vue'
</script>

<style scoped>
.asideMenu {
    transition: all 0.5s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s;
}
.fade-enter-active {
    transition-delay: 0.3s;
}
</style>
