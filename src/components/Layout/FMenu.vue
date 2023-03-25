<template>
    <div class="fMenu" :style="{ width: $store.state.menuWidth }">
        <el-menu
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            class="border-0"
            :default-active="defaultActive"
            @select="handleSelect"
        >
            <template v-for="(item, index) in menuList" :key="index">
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item
                        v-for="(item2, index2) in item.child"
                        :key="index2"
                        :index="item2.frontpath"
                    >
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        {{ item2.name }}
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="item.frontpath">
                    <el-icon><component :is="item.icon"></component></el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
const route = useRoute()
const store = useStore()
// 菜单选中状态
const defaultActive = ref(route.path)
// 监听路由变化改变菜单选中状态
onBeforeRouteUpdate((to, from) => {
    defaultActive.value = to.path
})
// 菜单收缩状态
const isCollapse = computed(() => !(store.state.menuWidth === '250px'))
// 菜单列表
const menuList = computed(() => store.state.menus)
// 菜单点击事件
const handleSelect = e => {
    router.push(e)
}
</script>

<style scoped>
.fMenu {
    transition: all 0.5s;
    top: 64px;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    @apply shadow-md fixed bg-white;
}
.fMenu::-webkit-scrollbar {
    width: 0;
}
</style>
