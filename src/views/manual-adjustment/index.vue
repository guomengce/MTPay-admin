<template>
  <section class="admin-page manual-adjustment">
    <div><el-button :icon="Back" @click="router.go(-1)">返回</el-button></div>
    <AdminPanel v-if="info" :title="increase ? '人工增加详情' : '人工扣减详情'" :icon="Tickets">
      <template #extra><StatusBadge :label="info.transaction.status_name" :type="info.transaction.status_group === 'completed' || info.transaction.status_group === 'success' ? 'success' : 'gray'" /></template>
      <div class="manual-adjustment__summary">
        <div><StatusBadge :label="increase ? '人工增加' : '人工扣减'" :type="increase ? 'success' : 'danger'" /><strong>{{ info.transaction.order_no }}</strong></div>
        <strong class="manual-adjustment__amount" :class="{ 'is-increase': increase }">{{ increase ? '+' : '−' }}{{ formatMoney(info.transaction.amount) }} {{ info.transaction.currency_code }}</strong>
      </div>
      <dl class="manual-adjustment__fields">
        <div><dt>代理公司</dt><dd>{{ info.transaction.user?.company_name || '—' }}</dd></div>
        <div><dt>代理邮箱</dt><dd>{{ info.transaction.user?.email || '—' }}</dd></div>
        <div><dt>币种</dt><dd>{{ info.transaction.currency_code }}</dd></div>
        <div><dt>操作人</dt><dd>{{ detail?.admin_name || '—' }}</dd></div>
        <div><dt>操作时间</dt><dd>{{ detail?.created_at || info.transaction.submitted_at || '—' }}</dd></div>
        <div class="is-wide"><dt>调整原因</dt><dd>{{ detail?.reason || '—' }}</dd></div>
      </dl>
    </AdminPanel>
    <el-empty v-else-if="!loading" :description="error || '暂无调账记录'"><el-button @click="load">重试</el-button></el-empty>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Back, Tickets } from '@element-plus/icons-vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { ManualBalanceAdjustmentDetail } from '@/api/modules/transaction';
import { formatMoney } from '@/utils/formatMoney';
import { usePageLoading } from '@/composables/usePageLoading';
import { useManualAdjustment } from './useManualAdjustment';
const router = useRouter();
const { info, loading, error, load } = useManualAdjustment();
usePageLoading(loading);
const increase = computed(() => info.value?.transaction.business_type === 'manual_increase');
const detail = computed(() => info.value?.detail as ManualBalanceAdjustmentDetail | undefined);
</script>
<style scoped lang="scss">
.manual-adjustment {
  &__summary { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:24px; border-bottom:1px solid #e4ebf3; > div { display:grid; gap:12px; min-width:0; } strong { overflow-wrap:anywhere; } }
  &__amount { color:#d43d49; font-size:clamp(22px,3vw,32px); font-variant-numeric:tabular-nums; &.is-increase { color:#079b87; } }
  &__fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:0 24px; margin:0; padding:8px 24px 24px; > div { display:grid; grid-template-columns:100px minmax(0,1fr); gap:12px; padding:16px 0; border-bottom:1px solid #eef2f7; } .is-wide { grid-column:1 / -1; } dt { color:var(--app-text-label); } dd { margin:0; overflow-wrap:anywhere; white-space:pre-wrap; } }
}
@include mobile { .manual-adjustment { &__summary { align-items:flex-start; flex-direction:column; padding:18px; } &__fields { grid-template-columns:1fr; padding:0 18px 18px; } } }
</style>
