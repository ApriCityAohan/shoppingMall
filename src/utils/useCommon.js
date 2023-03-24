import { ref, reactive, computed } from 'vue'
import { toast } from '~/utils/util.js'
// 列表、分页、搜索
export function initTableData(opt = {}) {
    // 搜索表单处理
    let searchForm = null
    let handleResetSearch = null
    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        handleResetSearch = () => {
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
            getData()
        }
    }
    // 列表
    const tableData = ref([])
    // Loading状态
    const loading = ref(false)
    // 页码
    const currentPage = ref(1)
    const total = ref(0)
    const limit = ref(10)
    // 获取列表数据
    function getData(page) {
        if (typeof page === 'number') {
            currentPage.value = page
        }
        loading.value = true
        opt.getListFun(currentPage.value, searchForm)
            .then(res => {
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess === 'function') {
                    opt.onGetListSuccess(res)
                } else {
                    tableData.value = res.list
                    total.value = res.totalCount
                }
            })
            .finally(() => {
                loading.value = false
            })
    }
    getData()

    // 删除公告
    const handleDelete = id => {
        loading.value = true
        opt.delete(id)
            .then(res => {
                toast('删除成功')
                getData(currentPage.value)
            })
            .finally(() => {
                loading.value = false
            })
    }
    // 修改管理员状态
    const handleStatusChange = (status, row) => {
        row.statusLoading = true
        opt.updateStatus(row.id, status)
            .then(res => {
                toast('修改状态成功')
                row.status = status
            })
            .finally(() => {
                row.statusLoading = false
            })
    }
    return {
        searchForm,
        handleResetSearch,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData,
        handleDelete,
        handleStatusChange
    }
}
// 新增、编辑
export function initForm(opt = {}) {
    // 抽屉Ref
    const drawerRef = ref(null)
    // 抽屉标识
    const editId = ref(0)
    // 抽屉标题
    const drawerTitle = computed(() => {
        return editId.value ? '修改' : '新增'
    })
    // 表单Ref
    const formRef = ref(null)
    // const definedForm = opt.definedForm
    const form = reactive({})

    // 表单验证规则
    const rules = ref(opt.rules || {})
    function initForm(row = false) {
        if (formRef.value) formRef.value.clearValidate()
        if (row) {
            for (const key in form) {
                form[key] = row[key]
            }
        }
    }
    // 新增
    const handleAdd = () => {
        editId.value = 0
        initForm(opt.form)
        drawerRef.value.open()
    }
    // 修改
    const handleEdit = row => {
        editId.value = row.id
        initForm(row)
        drawerRef.value.open()
    }

    // 提交表单
    const handleSubmit = () => {
        formRef.value.validate(valid => {
            if (!valid) return false
            drawerRef.value.loadOn()
            opt.loading.value = true
            const fun = editId.value ? opt.update(editId.value, form) : opt.create(form)
            fun.then(res => {
                toast(drawerTitle.value + '成功')
                opt.getData()
                drawerRef.value.close()
            }).finally(() => {
                drawerRef.value.loadOff()
                opt.loading.value = false
            })
        })
    }

    return {
        drawerRef,
        formRef,
        form,
        rules,
        editId,
        drawerTitle,
        handleAdd,
        handleEdit,
        handleSubmit
    }
}
