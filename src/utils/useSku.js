import { ref, nextTick, computed } from 'vue'
import {
    createGoodSku,
    updateGoodSkuCard,
    deleteGoodSkuCard,
    sortGoodSkuCard,
    createGoodSkuValue,
    updateGoodSkuCardValue,
    deleteGoodSkuCardValue,
    chooseGoodSkuCardValue
} from '~/api/goods.js'
// eslint-disable-next-line no-unused-vars
import { isArrayMoveUp, isArrayMoveDown, cartesianProductOf } from '~/utils/util.js'
// 商品id
export const goodsId = ref(0)
// 商品sku list
export const skuCardList = ref([])
export const skuList = ref([])
// 初始化sku list
export function initSkuCardList(list) {
    skuCardList.value = list.goodsSkusCard.map(item => {
        item.text = item.name
        item.loading = false
        item.goodsSkusCardValue.map(v => {
            v.text = v.value
            return v
        })
        return item
    })
    skuList.value = list.goodsSkus
    console.log(skuList.value)
}
// 创建sku规格选项
export const btnLoading = ref(false)
export function createGoodSkuOption() {
    btnLoading.value = true
    createGoodSku({
        goods_id: goodsId.value, // 商品ID
        name: '规格名称', // 规格名称
        order: 50, // 排序
        type: 0 // 规格类型 0文字
    })
        .then(res => {
            skuCardList.value.push({
                ...res,
                text: res.name,
                loading: false,
                goodsSkusCardValue: []
            })
            getTableData()
        })
        .finally(() => {
            btnLoading.value = false
        })
}
// 修改sku规格选项
export function updateGoodSkuOption(item) {
    item.loading = true
    updateGoodSkuCard(item.id, {
        goods_id: item.goods_id,
        name: item.text,
        order: item.order,
        type: 0
    })
        .then(res => {
            item.name = res.text
            getTableData()
        })
        .catch(() => {
            item.text = item.name
        })
        .finally(() => {
            item.loading = false
        })
}
// 删除sku规格选项
export function deleteGoodSkuOption(item) {
    item.loading = true
    deleteGoodSkuCard(item.id).then(res => {
        const i = skuCardList.value.findIndex(o => o.id === item.id)
        if (i > -1) skuCardList.value.splice(i, 1)
        getTableData()
    })
}
// sku规格选项排序
export function skuOptionMove(action, index) {
    const oList = JSON.parse(JSON.stringify(skuCardList.value))
    const fun = action === 'up' ? isArrayMoveUp : isArrayMoveDown
    fun(oList, index)
    const sortData = oList.map((item, i) => {
        return {
            id: item.id,
            order: i
        }
    })
    sortGoodSkuCard({ sortdata: sortData })
        .then(res => {
            fun(skuCardList.value, index)
            getTableData()
        })
        .finally(() => {})
}

// 选择设置商品规格选项和值
export function handleChooseSetSkuValue(id, data) {
    const item = skuCardList.value.find(o => o.id === id)
    item.loading = true
    chooseGoodSkuCardValue(id, data)
        .then(res => {
            item.name = item.text = res.goods_skus_card.name
            console.log(res)
            item.goodsSkusCardValue = res.goods_skus_card_value.map(v => {
                v.text = v.value
                return v
            })
            getTableData()
        })
        .finally(() => {
            item.loading = false
        })
}

// 初始化sku规格选项详情
export function initSkuCardValue(id) {
    const item = skuCardList.value.find(o => o.id === id)
    const loading = ref(false)
    const inputValue = ref('')
    const inputVisible = ref(false)
    const InputRef = ref()

    const handleClose = tag => {
        loading.value = true
        deleteGoodSkuCardValue(tag.id)
            .then(res => {
                const i = item.goodsSkusCardValue.findIndex(o => o.id === tag.id)
                if (i > -1) item.goodsSkusCardValue.splice(i, 1)
                getTableData()
            })
            .finally(() => {
                loading.value = false
            })
    }

    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value.input.focus()
        })
    }
    const handleInputConfirm = () => {
        if (!inputValue.value) {
            inputVisible.value = false
            return
        }
        loading.value = true
        createGoodSkuValue({
            goods_skus_card_id: id, // 规格ID
            name: item.name, // 规格名称
            order: 50, // 排序
            value: inputValue.value // 规格选项名称
        })
            .then(res => {
                item.goodsSkusCardValue.push({
                    ...res,
                    text: res.value
                })
                getTableData()
            })
            .finally(() => {
                inputVisible.value = false
                inputValue.value = ''
                loading.value = false
            })
    }
    const handleChange = (item, sku) => {
        console.log(sku)
        loading.value = true
        updateGoodSkuCardValue(sku.id, {
            goods_skus_card_id: id, // 规格ID
            name: sku.name, // 规格名称
            order: sku.order, // 排序
            value: item // 规格选项
        })
            .then(res => {
                sku.value = item
                getTableData()
            })
            .catch(() => {
                sku.text = sku.value
            })
            .finally(() => {
                loading.value = false
            })
    }
    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        handleClose,
        showInput,
        handleInputConfirm,
        handleChange,
        loading
    }
}

// 初始化sku规格表格
export function initSkuTable() {
    const skuLabels = computed(() => {
        return skuCardList.value.filter(i => i.goodsSkusCardValue.length > 0)
    })
    const skuTableThs = computed(() => {
        const length = skuLabels.value.length
        return [
            {
                name: '商品规格',
                colSpan: length,
                rowSpan: length > 0 ? 1 : 2,
                width: '100'
            },
            {
                name: '销售价',
                width: '100',
                rowSpan: 2
            },
            {
                name: '市场价',
                width: '100',
                rowSpan: 2
            },
            {
                name: '成本价',
                width: '100',
                rowSpan: 2
            },
            {
                name: '库存',
                width: '100',
                rowSpan: 2
            },
            {
                name: '体积',
                width: '100',
                rowSpan: 2
            },
            {
                name: '重量',
                width: '100',
                rowSpan: 2
            },
            {
                name: '编码',
                width: '100',
                rowSpan: 2
            }
        ]
    })
    return {
        skuLabels,
        skuTableThs,
        skuList
    }
}
function getTableData() {
    setTimeout(() => {
        if (skuCardList.value.length === 0) return []
        const list = []
        skuCardList.value.forEach(item => {
            if (item.goodsSkusCardValue.length > 0) {
                list.push(item.goodsSkusCardValue)
            }
        })
        if (list.length === 0) return []
        const data = cartesianProductOf(...list)
        skuList.value = []
        skuList.value = data.map(o => {
            return {
                code: '',
                cprice: '0.00',
                goods_id: goodsId.value,
                image: '',
                oprice: '0.00',
                pprice: '0.00',
                skus: o,
                stock: 0,
                volume: 0,
                weight: 0
            }
        })
    }, 200)
}
