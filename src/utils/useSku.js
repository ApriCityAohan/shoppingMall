import { ref, nextTick } from 'vue'
import {
    createGoodSku,
    updateGoodSkuCard,
    deleteGoodSkuCard,
    sortGoodSkuCard,
    createGoodSkuValue
} from '~/api/goods.js'
// eslint-disable-next-line no-unused-vars
import { isArrayMoveUp, isArrayMoveDown } from '~/utils/util.js'
// 商品id
export const goodsId = ref(0)
// 商品sku list
export const skuCardList = ref([])
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
        })
        .finally(() => {})
}

// 初始化sku规格选项详情
export function initSkuCardValue(id) {
    const item = skuCardList.value.find(o => o.id === id)

    const inputValue = ref('')
    const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
    const inputVisible = ref(false)
    const InputRef = ref()

    const handleClose = tag => {
        dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    }

    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value.input.focus()
        })
    }
    const loading = ref(false)
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
            })
            .finally(() => {
                inputVisible.value = false
                inputValue.value = ''
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
        loading
    }
}
