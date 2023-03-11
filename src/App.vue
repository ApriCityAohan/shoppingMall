<script setup></script>

<template>
    <router-view></router-view>
</template>

<style>
body {
    @apply bg-gray-100;
}
#nprogress .bar {
    background-color: #f4f4f4 !important;
    height: 2px !important;
}
::-webkit-scrollbar {
    width: 4px;
    height: 8px;
}
::-webkit-scrollbar-corner {
    display: block;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
