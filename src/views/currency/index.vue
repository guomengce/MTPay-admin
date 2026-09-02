<template>
  <section class="admin-page currency-page">
    <AdminHero title="幣種管理" :icon="Coin"><template #extra><el-button v-if="canOperate('currencies.create')" type="primary" :icon="Plus" @click="openCreate">新增幣種</el-button></template></AdminHero>
    <AdminPanel>
      <CurrencyFilters v-model:keyword="keyword" v-model:status="status" @search="search" @reset="resetFilters" />
      <CurrencyTable :data="list" :loading="loading" @edit="openEdit" @toggle-status="changeStatus" />
      <CurrencyCardList :data="list" :loading="loading" @edit="openEdit" @toggle-status="changeStatus" />
      <TablePager v-model="page" v-model:page-size="limit" :total="total" />
    </AdminPanel>
    <AddCurrencyDialog v-model="dialogVisible" :currency="editingCurrency" :submitting="adding||editing" @submit="submitCurrency" />
  </section>
</template>
<script setup lang="ts">
import{ref}from'vue';import{Coin,Plus}from'@element-plus/icons-vue';import type{AddCurrencyPayload,CurrencyItem}from'@/api/modules/currency';import AdminHero from'@/components/admin/AdminHero.vue';import AdminPanel from'@/components/admin/AdminPanel.vue';import TablePager from'@/components/common/TablePager.vue';import AddCurrencyDialog from'./components/AddCurrencyDialog.vue';import CurrencyCardList from'./components/CurrencyCardList.vue';import CurrencyFilters from'./components/CurrencyFilters.vue';import CurrencyTable from'./components/CurrencyTable.vue';import{useCurrencyManagement}from'./composables/useCurrencyManagement';import{usePermission}from'@/composables/usePermission';
const{canOperate}=usePermission();const dialogVisible=ref(false);const editingCurrency=ref<CurrencyItem|null>(null);const{list,loading,adding,editing,page,limit,total,keyword,status,search,resetFilters,createCurrency,updateCurrency,changeStatus}=useCurrencyManagement();
function openCreate(){editingCurrency.value=null;dialogVisible.value=true}function openEdit(row:CurrencyItem){editingCurrency.value=row;dialogVisible.value=true}
async function submitCurrency(payload:AddCurrencyPayload){const success=editingCurrency.value?await updateCurrency({id:editingCurrency.value.id,name:payload.name,...(editingCurrency.value.type===2?{fee_amount:payload.fee_amount}:{})}):await createCurrency(payload);if(success)dialogVisible.value=false}
</script>
<style scoped lang="scss">.currency-page{gap:22px}</style>