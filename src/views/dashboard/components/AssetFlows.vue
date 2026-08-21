<template>
  <AdminPanel title="近期资金流水" :icon="Tickets">
    <template #extra><RouterLink class="text-link" to="/transactions">查看全部 →</RouterLink></template>
    <TransactionTable :data="transactions" @view="openDetail" />
  </AdminPanel>
</template>
<script setup lang="ts">
import { Tickets } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import type { OperationTransactionItem } from '@/api/modules/dashboard';
import type { TransactionItem } from '@/api/modules/transaction';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TransactionTable from '@/views/transaction/components/TransactionTable.vue';
defineProps<{ transactions: OperationTransactionItem[] }>();
const router=useRouter();
function openDetail(row:TransactionItem){void router.push({name:'TransactionDetail',params:{businessType:row.detail_type,businessId:row.detail_id}})}
</script>
