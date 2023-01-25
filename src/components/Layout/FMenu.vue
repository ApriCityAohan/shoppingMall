<template>
    <div class="fMenu" :style="{ width: $store.state.menuWidth }">
        <el-menu
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            class="border-0"
            default-active="/"
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
const isCollapse = computed(() => !(store.state.menuWidth === '250px'))
const menuList = [
    {
        id: 1,
        name: '后台面板',
        icon: 'help',
        child: [
            {
                id: 12,
                name: '主控台',
                icon: 'home-filled',
                frontpath: '/'
            }
        ]
    },
    {
        id: 2,
        name: '商品管理',
        icon: 'shopping-bag',
        child: [
            {
                id: 22,
                name: '商品管理',
                icon: 'shopping-cart-full',
                frontpath: '/goods/list'
            }
        ]
    }
]
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
</style>
