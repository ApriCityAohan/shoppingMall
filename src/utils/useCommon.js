import { ref, reactive } from 'vue'

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
    return {
        searchForm,
        handleResetSearch,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData
    }
}
