<template>
  <section v-loading="loading" class="admin-page withdrawal-detail-page">
    <template v-if="detail">
      <DetailHero
        compact
        order="订单号"
        title="出金订单详情"
        :description="heroDescription"
        :order-id="detail.order_no"
        :status="heroStatus"
        :actions="heroActions"
        @back="goBack"
        @approve="openAction('approve')"
        @reject="openAction('reject')"
        @supplement="openAction('supplement')"
        @payment="openAction('payment')"
        @append="openAction('append')"
      />

      <AdminPanel title="金额构成" subtitle="收款人实收 + 固定手续费 = 账户总扣款" :icon="Money">
        <div class="amount-flow">
          <div class="amount-flow__block is-receive">
            <small>收款人实收</small>
            <p><strong>{{ detail.amount }}</strong><span>{{ detail.currency.code }}</span></p>
          </div>
          <span class="amount-flow__op">＋</span>
          <div class="amount-flow__block is-fee">
            <small>固定手续费</small>
            <p><strong>{{ detail.fee_amount }}</strong><span>{{ detail.currency.code }}</span></p>
          </div>
          <span class="amount-flow__op">＝</span>
          <div class="amount-flow__block is-total">
            <small>账户总扣款</small>
            <p><strong>{{ detail.total_amount }}</strong><span>{{ detail.currency.code }}</span></p>
          </div>
        </div>

        <div class="fund-impact" :class="`is-${detail.status}`">
          <span><el-icon><Wallet /></el-icon></span>
          <p><strong>{{ fundImpact.title }}</strong>{{ fundImpact.description }}</p>
        </div>
      </AdminPanel>

      <AdminPanel title="订单信息" subtitle="申请代理与关键时间" :icon="Tickets">
        <div class="order-info">
          <article class="order-info__cell is-agent">
            <span class="order-info__icon"><el-icon><UserFilled /></el-icon></span>
            <div class="order-info__body">
              <small>申请代理</small>
              <strong>{{ detail.user.company_name }}</strong>
              <p>{{ detail.user.agent_code }} · {{ detail.user.email }}</p>
            </div>
          </article>
          <article class="order-info__cell">
            <span class="order-info__icon is-time"><el-icon><Calendar /></el-icon></span>
            <div class="order-info__body">
              <small>提交时间</small>
              <strong>{{ detail.submitted_at || '—' }}</strong>
            </div>
          </article>
          <article class="order-info__cell">
            <span class="order-info__icon is-updated"><el-icon><RefreshLeft /></el-icon></span>
            <div class="order-info__body">
              <small>最后更新</small>
              <strong>{{ detail.updated_at || '—' }}</strong>
            </div>
          </article>
        </div>
      </AdminPanel>

      <div class="withdrawal-detail-page__workspace">
        <main class="withdrawal-detail-page__main">
          <AdminPanel title="付款关系" subtitle="核对提交时保存的付款人与收款人快照" :icon="CreditCard">
            <div class="party-flow">
              <article class="party-card is-payer">
                <header><span>付款人</span><small>{{ partyType(detail.payer) }}</small></header>
                <h3>{{ detail.payer?.name ?? '—' }}</h3><p>{{ detail.payer?.whitelist_no ?? '—' }}</p>
                <section v-if="payerBankFields.length" class="party-sub">
                  <h4>银行信息</h4>
                  <dl class="detail-fields">
                    <div v-for="item in payerBankFields" :key="item.key" :class="{ 'is-wide': item.wide }">
                      <dt>{{ item.label }}</dt><dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd>
                    </div>
                  </dl>
                </section>
                <section v-if="payerSubjectFields.length" class="party-sub">
                  <h4>主体信息</h4>
                  <dl class="detail-fields">
                    <div v-for="item in payerSubjectFields" :key="item.key" :class="{ 'is-wide': item.wide }">
                      <dt>{{ item.label }}</dt><dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd>
                    </div>
                  </dl>
                </section>
              </article>
              <span class="party-flow__arrow"><el-icon><Right /></el-icon></span>
              <article class="party-card is-payee">
                <header><span>收款人</span><small>{{ partyType(detail.payee) }}</small></header>
                <h3>{{ detail.payee?.name ?? '—' }}</h3><p>{{ detail.payee?.whitelist_no ?? '—' }}</p>
                <section v-if="payeeBankFields.length" class="party-sub">
                  <h4>银行信息</h4>
                  <dl class="detail-fields">
                    <div v-for="item in payeeBankFields" :key="item.key" :class="{ 'is-wide': item.wide }">
                      <dt>{{ item.label }}</dt><dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd>
                    </div>
                  </dl>
                </section>
                <section v-if="payeeSubjectFields.length" class="party-sub">
                  <h4>主体信息</h4>
                  <dl class="detail-fields">
                    <div v-for="item in payeeSubjectFields" :key="item.key" :class="{ 'is-wide': item.wide }">
                      <dt>{{ item.label }}</dt><dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd>
                    </div>
                  </dl>
                </section>
              </article>
            </div>
          </AdminPanel>

          <AdminPanel v-if="allFiles.length" title="订单文件" subtitle="代理申请材料与平台付款凭证" :icon="Files">
            <div class="file-groups">
              <section v-if="detail.application_files.length" class="file-group">
                <header><strong>申请证明</strong><span>{{ detail.application_files.length }} 个文件</span></header>
                <WithdrawalFileList :files="detail.application_files" :is-loading="isFileLoading" @preview="preview" @download="download" />
              </section>
              <section v-if="detail.payment_files.length" class="file-group is-payment">
                <header><strong>付款凭证</strong><span>{{ detail.payment_files.length }} 个文件</span></header>
                <WithdrawalFileList :files="detail.payment_files" :is-loading="isFileLoading" @preview="preview" @download="download" />
              </section>
            </div>
          </AdminPanel>

          <AdminPanel v-if="resultSections.length" title="处理结果" subtitle="审核、付款执行与资金状态的真实记录" :icon="CircleCheck">
            <div class="result-sections">
              <section v-for="section in resultSections" :key="section.title">
                <h3>{{ section.title }}</h3>
                <dl class="detail-fields">
                  <div v-for="item in section.fields" :key="item.key" :class="{ 'is-wide': item.wide }">
                    <dt>{{ item.label }}</dt><dd :class="{ 'is-accent': item.accent }">{{ item.value }}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </AdminPanel>
        </main>

        <aside v-if="timelineItems.length" class="withdrawal-detail-page__aside">
          <AdminPanel class="timeline-panel"><AdminTimeline title="处理时间线" :items="timelineItems" /></AdminPanel>
        </aside>
      </div>

      <WithdrawalActionDialog
        v-model="dialogVisible"
        :row="actionRow"
        :mode="actionMode"
        :submitting="submitting"
        :uploading="uploading"
        @submit="handleAction"
      />
    </template>
    <el-empty v-else-if="!loading" description="未找到出金订单" />
  </section>
</template>

<script setup lang="ts">
/** 管理端 USD 出金详情：页面结构和可用动作完全由详情接口字段决定。 */
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Calendar, CircleCheck, CircleClose, CreditCard, DocumentAdd, Files, Money, RefreshLeft, Right, Tickets, Upload, UserFilled, Wallet } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';
import WithdrawalActionDialog from '../components/WithdrawalActionDialog.vue';
import type { WithdrawalActionMode } from '../components/WithdrawalActionDialog.vue';
import WithdrawalFileList from '../components/WithdrawalFileList.vue';
import { getWithdrawalStatusMeta, toWithdrawalRow } from '../composables/mapper';
import { useWithdrawalAttachments } from '../composables/useWithdrawalAttachments';
import { useWithdrawalDetail } from '../composables/useWithdrawalDetail';
import { useWithdrawalDetailView } from '../composables/useWithdrawalDetailView';

const route = useRoute();
const router = useRouter();
const { detail, loading, submitting, uploading, loadDetail, requestSupplement, submitReview, submitPayment, appendPaymentFiles, uploadFiles } = useWithdrawalDetail();
const { isLoading: isFileLoading, preview, download } = useWithdrawalAttachments();
const { payerBankFields, payeeBankFields, payerSubjectFields, payeeSubjectFields, reviewFields, paymentFields, timelineItems, partyType } = useWithdrawalDetailView(detail);

const heroStatus = computed(() => {
  const status = detail.value?.status ?? 0;
  return { label: detail.value?.status_name || '未知状态', ...getWithdrawalStatusMeta(status) };
});

const heroDescription = computed(() => {
  const current = detail.value;
  return current ? `${current.payer?.name ?? '—'} → ${current.payee?.name ?? '—'}` : '';
});

const heroActions = computed<HeroAction[]>(() => {
  const available = detail.value?.available_actions;
  if (!available) return [];
  const actions: HeroAction[] = [];
  if (available.admin_can_approve) actions.push({ label: '审核通过', icon: CircleCheck, type: 'success', emitName: 'approve' });
  if (available.admin_can_request_supplement) actions.push({ label: '要求补件', icon: DocumentAdd, type: 'warning', emitName: 'supplement' });
  if (available.admin_can_reject) actions.push({ label: '驳回', icon: CircleClose, type: 'danger', emitName: 'reject' });
  if (available.admin_can_process_payment) actions.push({ label: '登记付款结果', icon: CreditCard, type: 'primary', emitName: 'payment' });
  if (available.admin_can_append_payment_files) actions.push({ label: '追加付款凭证', icon: Upload, type: 'primary', emitName: 'append' });
  return actions;
});

const fundImpact = computed(() => {
  const d = detail.value;
  if (!d) return { title: '资金状态', description: '' };
  const amount = `${d.total_amount ?? '—'} ${d.currency?.code ?? 'USD'}`;
  if (d.status === 3) {
    const at = d.payment?.completed_at;
    return { title: '资金已正式扣除', description: `订单完成，冻结的 ${amount} 已完成扣款${at ? `（${at}）` : ''}。` };
  }
  if (d.status === 4) {
    const at = d.fund_times?.rejected_at;
    return { title: '冻结资金已释放', description: `订单已驳回，${amount} 已释放回代理可用余额${at ? `（${at}）` : ''}。` };
  }
  if (d.status === 5) {
    const at = d.payment?.failed_at;
    return { title: '冻结资金已释放', description: `付款失败，${amount} 已释放，原订单不可重试${at ? `（${at}）` : ''}。` };
  }
  if (d.status === 2) {
    const at = d.payment?.processing_at;
    return { title: '等待付款执行', description: `${amount} 仍处于冻结状态${at ? `，${at} 起` : ''}，登记付款结果后完成扣款或释放。` };
  }
  const at = d.fund_times?.frozen_at;
  return { title: '资金已冻结', description: `代理提交时已冻结 ${amount}${at ? `（${at}）` : ''}，审核通过不会重复扣款。` };
});

const allFiles = computed(() => [...(detail.value?.application_files ?? []), ...(detail.value?.payment_files ?? [])]);
const resultSections = computed(() => [
  reviewFields.value.length ? { title: '审核信息', fields: reviewFields.value } : null,
  paymentFields.value.length ? { title: '付款信息', fields: paymentFields.value } : null,
].filter((item): item is { title: string; fields: typeof reviewFields.value } => Boolean(item)));
const actionRow = computed(() => (detail.value ? toWithdrawalRow(detail.value) : null));
const dialogVisible = ref(false);
const actionMode = ref<WithdrawalActionMode>('approve');

function goBack() { void router.push('/withdrawal'); }
function openAction(mode: WithdrawalActionMode) { actionMode.value = mode; dialogVisible.value = true; }

async function handleAction(payload: { mode: WithdrawalActionMode; message?: string; result?: 'complete' | 'fail'; failureReason?: string; files: File[] }) {
  if (!detail.value) return;
  const id = detail.value.id;
  try {
    if (payload.mode === 'supplement') {
      await requestSupplement({ id, message: payload.message! });
      ElMessage.success('补件要求已发送');
    } else if (payload.mode === 'approve' || payload.mode === 'reject') {
      await submitReview({ id, decision: payload.mode, review_note: payload.mode === 'reject' ? payload.message : undefined });
      ElMessage.success(payload.mode === 'approve' ? '出金审核已通过，进入付款处理' : '出金已驳回，冻结资金已释放');
    } else if (payload.mode === 'payment') {
      const fileIds = payload.result === 'complete' ? await uploadFiles(payload.files) : [];
      await submitPayment({ id, result: payload.result!, file_ids: fileIds.length ? fileIds : undefined, failure_reason: payload.result === 'fail' ? payload.failureReason : undefined });
      ElMessage.success(payload.result === 'complete' ? '付款完成已登记' : '付款失败已登记，冻结资金已释放');
    } else {
      const fileIds = await uploadFiles(payload.files);
      await appendPaymentFiles({ id, file_ids: fileIds, message: payload.message });
      ElMessage.success('付款凭证已追加');
    }
    dialogVisible.value = false;
  } catch { /* 统一请求层已显示后端错误 */ }
}

onMounted(() => {
  const id = Number(route.params.id);
  if (Number.isInteger(id) && id > 0) void loadDetail(id);
});
</script>

<style scoped lang="scss">
.withdrawal-detail-page { gap: 20px; }
.amount-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 8px 24px 18px;

  &__block {
    min-width: 0;
    flex: 1 1 160px;
    padding: 18px 16px;
    border: 1px solid #e0e8f0;
    border-radius: 14px;
    background: #fbfcfe;
    text-align: center;

    small {
      color: var(--app-text-label);
      font-size: 12px;
    }

    p {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 8px;
      margin: 8px 0 0;
    }

    strong {
      color: var(--app-text-heading);
      font-size: clamp(24px, 2.4vw, 34px);
      line-height: 1;
      overflow-wrap: anywhere;
    }

    span {
      color: #078f89;
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__block.is-total {
    border-color: #b8dcd8;
    background: linear-gradient(135deg, #f4fbf9, #edf7f3);

    strong {
      color: #0a7f7a;
    }
  }

  &__op {
    flex: none;
    color: #9aa8b9;
    font-size: 24px;
    font-weight: 700;
  }
}

.order-info {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 14px;
  padding: 20px 24px 24px;

  &__cell {
    display: flex;
    min-width: 0;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border: 1px solid #e0e8f0;
    border-radius: 14px;
    background: #fbfcfe;
  }

  &__icon {
    display: inline-flex;
    width: 40px;
    height: 40px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    font-size: 19px;
    color: #7457e8;
    background: #f0edff;

    &.is-time {
      color: #2678da;
      background: #eaf3ff;
    }

    &.is-updated {
      color: #0aa39e;
      background: #e4f8f5;
    }
  }

  &__body {
    min-width: 0;
  }

  small {
    color: var(--app-text-label);
    font-size: 12px;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: var(--app-text-body);
    font-size: 15px;
    overflow-wrap: anywhere;
  }

  p {
    margin: 5px 0 0;
    color: var(--app-text-label);
    font-size: 12px;
    overflow-wrap: anywhere;
  }
}

.fund-impact { display: flex; align-items: center; gap: 10px; margin: 0 24px 22px; padding: 12px 14px; border: 1px solid #bde9e5; border-radius: 12px; color: #315a5b; background: #f1fbfa; }
.fund-impact > span { display: inline-flex; color: #0aa39e; font-size: 20px; }
.fund-impact p { margin: 0; line-height: 1.55; }
.fund-impact strong { margin-right: 10px; color: #087f7b; }
.fund-impact.is-4, .fund-impact.is-5 { border-color: #f0d6b6; color: #78542d; background: #fff9ef; }
.withdrawal-detail-page__workspace { display: grid; min-width: 0; align-items: start; grid-template-columns: minmax(0, 1.45fr) minmax(320px, .65fr); gap: 20px; }
.withdrawal-detail-page__main, .withdrawal-detail-page__aside { display: grid; min-width: 0; gap: 20px; }
.timeline-panel { padding: 22px; }
.party-flow { display: grid; align-items: center; padding: 8px 24px 24px; grid-template-columns: minmax(0, 1fr) 46px minmax(0, 1fr); gap: 12px; }
.party-flow__arrow { display: inline-flex; width: 40px; height: 40px; align-items: center; justify-content: center; border-radius: 50%; color: #0b9f98; background: #e8f8f5; font-size: 20px; }
.party-card { min-width: 0; overflow: hidden; padding: 18px; border: 1px solid #dde7ef; border-radius: 14px; background: #fbfcfe; }
.party-card.is-payee { border-color: #b6dcd6; background: #f5fcfa; }
.party-card.is-payee header span { color: #0a8b85; }
.party-card.is-payee h3 { color: #0b6f6a; }
.party-sub { margin-top: 16px; }
.party-sub > h4 { margin: 0; padding: 7px 10px; border-radius: 8px; color: #5e7186; background: #eef3f8; font-size: 12px; font-weight: 600; }
.party-sub .detail-fields { margin-top: 2px; }
.party-card header { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.party-card header span { color: #087f7b; font-size: 13px; font-weight: 700; }
.party-card header small { padding: 4px 8px; border-radius: 999px; color: #5e7186; background: #edf2f6; }
.party-card h3 { margin: 12px 0 0; color: var(--app-text-heading); font-size: 17px; overflow-wrap: anywhere; }
.party-card > p { margin: 5px 0 0; color: #138f91; font-family: ui-monospace, Consolas, monospace; font-size: 12px; overflow-wrap: anywhere; }
.detail-fields { display: grid; margin: 14px 0 0; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 16px; }
.detail-fields > div { min-width: 0; padding: 11px 0; border-bottom: 1px dashed #dfe7ef; }
.detail-fields > div.is-wide { grid-column: 1 / -1; }
.detail-fields dt { color: var(--app-text-label); font-size: 11px; }
.detail-fields dd { margin: 5px 0 0; color: var(--app-text-body); font-size: 13px; font-weight: 600; line-height: 1.55; overflow-wrap: anywhere; }
.detail-fields dd.is-mono { font-family: ui-monospace, Consolas, monospace; }
.detail-fields dd.is-accent { color: #078f89; }
.file-groups, .result-sections { display: grid; gap: 14px; padding: 6px 24px 24px; }
.file-group, .result-sections > section { overflow: hidden; border: 1px solid #e0e8f0; border-radius: 13px; background: #fbfcfe; }
.file-group > header { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid #e6edf3; }
.file-group > header strong { color: var(--app-text-heading); font-size: 13px; }
.file-group > header span { color: #087f7b; font-size: 12px; }
.file-group.is-payment { border-color: #cfe5e1; }
.result-sections > section { padding: 0 16px 14px; }
.result-sections h3 { margin: 0 -16px; padding: 12px 16px; border-bottom: 1px solid #e6edf3; color: var(--app-text-heading); background: #f5f8fb; font-size: 14px; }
@include narrow {
  .order-info {
    grid-template-columns: 1fr 1fr;

    .is-agent {
      grid-column: 1 / -1;
    }
  }

  .withdrawal-detail-page__workspace { grid-template-columns: 1fr; }
}
@include mobile {
  .withdrawal-detail-page { gap: 16px; }

  .amount-flow {
    flex-direction: column;
    gap: 8px;
    padding: 6px 16px 16px;

    &__block {
      width: 100%;
    }

    &__op {
      transform: rotate(90deg);
    }
  }

  .fund-impact {
    align-items: flex-start;
    margin: 0 16px 16px;
  }

  .order-info {
    grid-template-columns: 1fr;
    padding: 16px;

    .is-agent {
      grid-column: auto;
    }
  }

  .party-flow { padding: 4px 16px 16px; grid-template-columns: 1fr; }
  .party-flow__arrow { margin: 0 auto; transform: rotate(90deg); }
  .detail-fields { grid-template-columns: 1fr; }
  .detail-fields > div.is-wide { grid-column: auto; }
  .file-groups, .result-sections { padding: 4px 16px 16px; }
}
</style>
