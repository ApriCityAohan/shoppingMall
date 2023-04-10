<template>
    <el-form-item label="规格设置">
        <table class="border rounded">
            <thead>
                <tr>
                    <th
                        v-for="(th, thi) in skuTableThs"
                        :key="thi"
                        class="border"
                        :rowspan="th.rowSpan"
                        :colspan="th.colSpan"
                        :width="th.width"
                    >
                        {{ th.name }}
                    </th>
                </tr>
                <tr>
                    <th v-for="(th, thi) in skuLabels" :key="thi" class="border">
                        {{ th.name }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in skuList" :key="index">
                    <td
                        v-for="(td, tdI) in item.skus"
                        :key="tdI"
                        class="border text-center font-bold"
                        width="100"
                    >
                        {{ td.value }}
                    </td>
                    <td class="border">
                        <el-input v-model="item.pprice" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.oprice" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.cprice" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.stock" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.volume" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.weight" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.code" size="small"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
    </el-form-item>
</template>

<script setup>
import { initSkuTable } from '~/utils/useSku'
const { skuLabels, skuTableThs, skuList } = initSkuTable()
</script>

<style scoped></style>
