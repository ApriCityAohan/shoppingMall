<template>
    <div class="fMenu">
        <el-menu class="border-0" default-active="/" @select="handleSelect">
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
import { useRouter } from 'vue-router'
const router = useRouter()
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
    width: 250px;
    top: 64px;
    left: 0;
    bottom: 0;
    @apply shadow-md fixed;
}
</style>
