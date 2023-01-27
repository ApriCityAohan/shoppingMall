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
                        {{ item.name }}
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
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
const route = useRoute()
const store = useStore()
const defaultActive = ref(route.path)
const isCollapse = computed(() => !(store.state.menuWidth === '250px'))
const menuList = computed(() => store.state.menus)
const handleSelect = e => {
    console.log(e)
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
    @apply shadow-md fixed;
}
.fMenu::-webkit-scrollbar {
    width: 0;
}
</style>
