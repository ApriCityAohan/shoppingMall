<template>
    <el-aside v-loading="loading" width="220px" class="image-aside">
        <div class="top">
            <ImgAsideList v-for="(item, index) in list" :key="index" :active="activeId === item.id">
                {{ item.name }}
            </ImgAsideList>
        </div>
        <div class="bottom">
            <el-pagination
                v-model:current-page="currentPage"
                background
                layout="prev, next"
                :total="total"
                :page-size="limit"
                @current-change="getList"
            />
        </div>
    </el-aside>
    <Drawer ref="drawerRef" title="新增" @submit="handleSubmit">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="分类标题" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="form.num" :min="1" :max="1000" />
            </el-form-item>
        </el-form>
    </Drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getImagesClass } from '~/api/image_class.js'
import ImgAsideList from './ImgAsideList.vue'
import Drawer from './Drawer.vue'
// 状态
const loading = ref(false)
const list = ref([])
const activeId = ref(0)
// 页码
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
// 获取图片分类列表
function getList(page = null) {
    if (typeof page === 'number') {
        currentPage.value = page
    }
    loading.value = true
    getImagesClass(currentPage.value)
        .then(res => {
            // console.log(res)
            list.value = res.list
            total.value = res.totalCount
            const item = list.value[0]
            if (item) {
                activeId.value = item.id
            }
        })
        .finally(() => {
            loading.value = false
        })
}
getList()
// 抽屉Ref
const drawerRef = ref(null)
// 打开抽屉
const handleOpenDrawer = () => {
    drawerRef.value.open()
}
// 表单
const form = reactive({
    name: '',
    num: 50
})
// 规则
const rules = reactive({
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
})
const formRef = ref(null)
const handleSubmit = () => {
    formRef.value.validate(valid => {
        if (!valid) {
            return false
        }
        console.log('提交成功', form)
    })
}
defineExpose({
    handleOpenDrawer
})
</script>

<style scoped>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}
.image-aside .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;
    overflow: auto;
}
.image-aside .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    @apply flex justify-center items-center;
}
</style>
