<template>
  <section class="admin-page manual-adjustment">
    <template v-if="info">
      <DetailHero compact order="訂單號" :title="increase ? '人工增加詳情' : '人工扣減詳情'" :order-id="info.transaction.order_no" :status="heroStatus" @back="router.go(-1)" />
      <AdminPanel title="調賬信息" :icon="Tickets">
        <div class="manual-adjustment__summary">
          <span class="manual-adjustment__icon" :class="{ 'is-decrease': !increase }"><el-icon><Plus v-if="increase"/><Minus v-else/></el-icon></span>
          <div><small>調整金額</small><strong>{{ increase ? '+' : '−' }}{{ formatMoney(info.transaction.amount) }} <em>{{ info.transaction.currency_code }}</em></strong></div>
        </div>
        <div class="balance-flow">
          <div class="balance-flow__node"><small>調整前可用餘額</small><strong>{{ formatBalance(detail?.balance_before) }}</strong></div>
          <span class="balance-flow__arrow"><el-icon><Right /></el-icon></span>
          <div class="balance-flow__node is-result"><small>調整後可用餘額</small><strong>{{ formatBalance(detail?.balance_after) }}</strong></div>
        </div>
        <div class="manual-adjustment__details">
          <section class="info-group is-agent">
            <header><span><el-icon><OfficeBuilding /></el-icon></span><strong>代理帳戶</strong></header>
            <dl>
              <div><dt>代理公司</dt><dd>{{ info.transaction.user?.company_name || '—' }}</dd></div>
              <div><dt>代理郵箱</dt><dd>{{ info.transaction.user?.email || '—' }}</dd></div>
            </dl>
          </section>

          <section class="info-group is-operation">
            <header><span><el-icon><UserFilled /></el-icon></span><strong>操作資訊</strong></header>
            <dl>
              <div><dt>操作人</dt><dd>{{ detail?.admin?.name || detail?.admin_name || '—' }}</dd></div>
              <div><dt>操作時間</dt><dd>{{ detail?.adjusted_at || detail?.created_at || info.transaction.submitted_at || '—' }}</dd></div>
            </dl>
          </section>

          <section class="reason-panel">
            <header><el-icon><Document /></el-icon><strong>調整原因</strong></header>
            <p>{{ detail?.reason || '—' }}</p>
          </section>
        </div>
      </AdminPanel>
    </template>
    <el-empty v-else-if="!loading" :description="error || '暫無調賬記錄'"><el-button @click="load">重試</el-button></el-empty>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Document, Minus, OfficeBuilding, Plus, Right, Tickets, UserFilled } from '@element-plus/icons-vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import DetailHero from '@/components/detail/DetailHero.vue';
import type { HeroStatus } from '@/components/detail/DetailHero.vue';
import type { ManualBalanceAdjustmentDetail } from '@/api/modules/transaction';
import { formatMoney } from '@/utils/formatMoney';
import { usePageLoading } from '@/composables/usePageLoading';
import { useManualAdjustment } from './useManualAdjustment';
const router = useRouter();
const { info, loading, error, load } = useManualAdjustment();
usePageLoading(loading);
const increase = computed(() => info.value?.transaction.business_type === 'manual_increase');
const detail = computed(() => info.value?.detail as ManualBalanceAdjustmentDetail | undefined);
const heroStatus = computed<HeroStatus>(() => ({ label: info.value?.transaction.status_name || '—', type: info.value?.transaction.status_group === 'completed' || info.value?.transaction.status_group === 'success' ? 'success' : 'gray' }));
function formatBalance(value?: string | null) { return value == null || value === '' ? '—' : `${formatMoney(value)} ${info.value?.transaction.currency_code || ''}`.trim(); }
</script>
<style scoped lang="scss">
.manual-adjustment { gap: 20px; }
.manual-adjustment__summary { display:flex;align-items:center;gap:16px;padding:24px;border-bottom:1px solid #e5edf3;background:linear-gradient(135deg,#fbfefd,#f6fbff) }
.manual-adjustment__icon { display:grid;width:56px;height:56px;flex:0 0 56px;place-items:center;border-radius:16px;color:#fff;background:linear-gradient(135deg,#12b59f,#078f79);font-size:26px;box-shadow:0 10px 22px rgb(8 143 121 / 18%) }
.manual-adjustment__icon.is-decrease { background:linear-gradient(135deg,#fb7185,#dc3d51);box-shadow:0 10px 22px rgb(220 61 81 / 18%) }
.manual-adjustment__summary>div { display:grid;min-width:0;gap:5px }
.manual-adjustment__summary small { color:var(--app-text-label);font-size:12px }
.manual-adjustment__summary strong { color:var(--app-text-heading);font-size:clamp(25px,3vw,36px);font-variant-numeric:tabular-nums;overflow-wrap:anywhere }
.manual-adjustment__summary em { color:#078f89;font-size:15px;font-style:normal }
.balance-flow { display:grid;grid-template-columns:minmax(0,1fr) 42px minmax(0,1fr);align-items:center;gap:16px;padding:18px 24px;border-bottom:1px solid #e5edf3;background:#fff }
.balance-flow__node { display:grid;gap:7px;padding:15px 18px;border:1px solid #e0e8f0;border-radius:12px;background:#f8fafc }
.balance-flow__node small { color:var(--app-text-label);font-size:12px }
.balance-flow__node strong { color:var(--app-text-heading);font-size:18px;font-variant-numeric:tabular-nums;overflow-wrap:anywhere }
.balance-flow__node.is-result { border-color:#bfe5df;background:linear-gradient(135deg,#f0fbf8,#f7fcff) }
.balance-flow__node.is-result strong { color:#078f84 }
.balance-flow__arrow { display:grid;width:38px;height:38px;place-items:center;border:1px solid #cfe0e9;border-radius:50%;color:#0a9b91;background:#fff;box-shadow:0 6px 14px rgb(10 155 145 / 10%) }
.manual-adjustment__details { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:20px 24px 24px;background:#fbfcfe }
.info-group { overflow:hidden;border:1px solid #dfe8f0;border-radius:14px;background:#fff;box-shadow:0 8px 22px rgb(21 50 82 / 4%) }
.info-group>header { display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #e7edf3;color:var(--app-text-heading);background:#f6fafc }
.info-group>header span { display:grid;width:32px;height:32px;place-items:center;border-radius:9px;color:#087f78;background:#e4f6f3;font-size:17px }
.info-group.is-operation>header span { color:#2767c7;background:#eaf2ff }
.info-group>header strong { font-size:14px }
.info-group dl { display:grid;gap:0;margin:0;padding:4px 16px 10px }
.info-group dl>div { display:grid;grid-template-columns:92px minmax(0,1fr);gap:14px;padding:13px 0;border-bottom:1px dashed #e5ebf1 }
.info-group dl>div:last-child { border-bottom:0 }
.info-group dt { color:var(--app-text-label);font-size:12px }
.info-group dd { min-width:0;margin:0;color:var(--app-text-heading);font-size:14px;font-weight:650;overflow-wrap:anywhere }
.reason-panel { grid-column:1/-1;padding:16px 18px;border:1px solid #d9e6ee;border-left:4px solid #0a9b91;border-radius:12px;background:linear-gradient(100deg,#f2fbf9,#f8fbff) }
.reason-panel header { display:flex;align-items:center;gap:8px;color:#087f78;font-size:14px }
.reason-panel p { margin:12px 0 0;color:var(--app-text-body);font-size:14px;font-weight:550;line-height:1.7;overflow-wrap:anywhere;white-space:pre-wrap }
@include mobile { .manual-adjustment{gap:16px}.manual-adjustment__summary{align-items:flex-start;padding:18px}.manual-adjustment__icon{width:48px;height:48px;flex-basis:48px;border-radius:14px}.balance-flow{grid-template-columns:1fr;padding:14px}.balance-flow__arrow{margin:auto;transform:rotate(90deg)}.manual-adjustment__details{grid-template-columns:1fr;padding:14px}.reason-panel{grid-column:auto}.info-group dl>div{grid-template-columns:82px minmax(0,1fr)} }
</style>
