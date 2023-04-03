import { ref } from 'vue'
import { createGoodSku } from '~/api/goods.js'
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
// 初始化sku规格选项详情
export function initSkuCardValue(id) {
    const item = skuCardList.value.find(o => o.id === id)
    return { item }
}
