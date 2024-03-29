import { ref, reactive, computed } from 'vue'
import { toast } from '~/utils/util.js'
// 列表、分页、搜索、删除、修改状态
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
    // 多选Ids
    const multiSelectionIds = ref([])
    // 多选表格Ref
    const multipleTableRef = ref(null)
    // 多选删除事件
    const handleSelectionChange = e => {
        multiSelectionIds.value = e.map(o => o.id)
    }
    // 审核商品
    const handleAuditGoods = (id, status) => {
        // console.log(id, status)
        loading.value = true
        opt.audit(id, status)
            .then(res => {
                toast('审核完毕')
                getData(currentPage.value)
            })
            .finally(() => {
                loading.value = false
            })
    }
    // 多选删除
    const handleMultiDelete = () => {
        loading.value = true
        opt.delete(multiSelectionIds.value)
            .then(res => {
                toast('删除成功')
                if (multipleTableRef.value) {
                    multipleTableRef.value.clearSelection()
                }
                getData()
            })
            .finally(() => {
                loading.value = false
            })
    }
    const handleMultiStatusChange = status => {
        loading.value = true
        opt.updateStatus(multiSelectionIds.value, status)
            .then(res => {
                toast('修改成功')
                if (multipleTableRef.value) {
                    multipleTableRef.value.clearSelection()
                }
                getData()
            })
            .finally(() => {
                loading.value = false
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
        handleStatusChange,
        multipleTableRef,
        handleAuditGoods,
        handleSelectionChange,
        handleMultiDelete,
        handleMultiStatusChange,
        multiSelectionIds
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
    const defaultForm = opt.form
    const form = reactive({})

    // 表单验证规则
    const rules = ref(opt.rules || {})
    function initForm(row = false) {
        if (formRef.value) formRef.value.clearValidate()
        for (const key in defaultForm) {
            form[key] = row[key]
        }
    }
    // 新增
    const handleAdd = () => {
        editId.value = 0
        initForm(defaultForm)
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
            let body = {}
            if (opt.beforeSubmit && typeof opt.beforeSubmit === 'function') {
                body = opt.beforeSubmit({ ...form })
            } else {
                body = form
            }
            const fun = editId.value ? opt.update(editId.value, body) : opt.create(body)
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
