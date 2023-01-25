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
                <router-view></router-view>
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
</style>
