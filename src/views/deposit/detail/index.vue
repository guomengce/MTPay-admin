<template>
  <section v-loading="loading" class="admin-page deposit-detail-page">
    <template v-if="detail">
      <DetailHero
        compact
        order="订单号"
        title="数字货币入金审核"
        description="核对链上凭证与申报金额后完成审核"
        :order-id="detail.order_no"
        :status="heroStatus"
        :actions="heroActions"
        @back="goBack"
        @approve="openReviewDialog('approve')"
        @reject="openReviewDialog('reject')"
      />

      <section class="deposit-core">
        <div class="deposit-core__amount">
          <span class="deposit-core__icon">
            <el-icon><Wallet /></el-icon>
          </span>
          <div>
            <small>申报入金金额</small>
            <p>
              <strong>{{ detail.amount }}</strong
              ><span>{{ detail.currency.code }}</span>
            </p>
            <em
              >{{ detail.currency.name }} · {{ detail.network.name }}（{{
                detail.network.code
              }}）</em
            >
          </div>
        </div>
        <div class="deposit-core__meta">
          <article>
            <span class="is-purple">
              <el-icon><UserFilled /></el-icon>
            </span>
            <div>
              <small>申请代理</small><strong>{{ detail.user.company_name }}</strong>
              <p>{{ detail.user.agent_code }} · {{ detail.user.email }}</p>
            </div>
          </article>
          <article>
            <span class="is-blue">
              <el-icon><Calendar /></el-icon>
            </span>
            <div>
              <small>提交时间</small><strong>{{ detail.submitted_at || '—' }}</strong>
            </div>
          </article>
        </div>
      </section>

      <div v-if="detail.status === 0" class="review-impact">
        <span>
          <el-icon><InfoFilled /></el-icon>
        </span>
        <p>
          <strong>审核影响</strong>通过后将为 {{ detail.user.company_name }} 增加
          <b>{{ detail.amount }} {{ detail.currency.code }}</b> 可用余额。
        </p>
      </div>

      <div class="deposit-detail-page__split">
        <AdminPanel
          class="chain-verification"
          title="链上核验"
          subtitle="确认交易哈希与平台收款地址一致"
          :icon="Link"
        >
          <dl class="chain-verification__list">
            <div>
              <dt>交易哈希 Txid</dt>
              <dd>
                <code>{{ detail.txid }}</code>
                <el-button
                  text
                  circle
                  :icon="DocumentCopy"
                  aria-label="复制交易哈希"
                  @click="copyValue('交易哈希', detail.txid)"
                />
              </dd>
            </div>
            <div>
              <dt>平台收款地址</dt>
              <dd>
                <code>{{ detail.receiving_address_snapshot }}</code>
                <el-button
                  text
                  circle
                  :icon="DocumentCopy"
                  aria-label="复制平台收款地址"
                  @click="copyValue('平台收款地址', detail.receiving_address_snapshot)"
                />
              </dd>
            </div>
          </dl>
        </AdminPanel>

        <AdminPanel v-if="timelineItems.length" class="deposit-timeline">
          <AdminTimeline title="处理时间线" :items="timelineItems" />
        </AdminPanel>
      </div>

      <AdminPanel
        v-if="resultItems.length"
        class="review-result"
        :title="detail.status === 1 ? '入账结果' : '驳回结果'"
        :subtitle="detail.status === 1 ? '审核完成后的资金入账记录' : '本次入金未通过审核'"
        :icon="detail.status === 1 ? CircleCheck : CircleClose"
      >
        <dl class="review-result__grid">
          <div v-for="item in resultItems" :key="item.label" :class="{ 'is-wide': item.wide }">
            <dt>{{ item.label }}</dt>
            <dd :class="{ 'is-accent': item.accent }">{{ item.value }}</dd>
          </div>
        </dl>
      </AdminPanel>

      <DepositAddDialog
        v-model="dialogVisible"
        :row="reviewRow"
        :mode="dialogMode"
        :submitting="reviewing"
        @submit="handleSubmit"
      />
    </template>
    <el-empty v-else-if="!loading" description="未找到入金订单" />
  </section>
</template>

<script setup lang="ts">
/** 管理端入金审核详情：直接使用详情接口数据，避免展示模型丢字段或制造假数据。 */
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Calendar,
  CircleCheck,
  CircleClose,
  DocumentCopy,
  InfoFilled,
  Link,
  UserFilled,
  Wallet,
} from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';

import DepositAddDialog from '../components/DepositAddDialog.vue';
import type { DepositRow } from '../composables/mapper';
import { useDepositDetail } from '../composables/useDepositDetail';

interface ResultItem {
  label: string;
  value: string;
  wide?: boolean;
  accent?: boolean;
}

const route = useRoute();
const router = useRouter();
const { detail, loading, reviewing, loadDetail, submitReview } = useDepositDetail();

const statusType = computed<StatusBadgeType>(() => {
  if (detail.value?.status === 1) return 'success';
  if (detail.value?.status === 2) return 'danger';
  return 'warning';
});

const heroStatus = computed(() => ({
  label: detail.value?.status_name || '未知状态',
  type: statusType.value,
  effect: detail.value?.status === 0 ? ('pending' as const) : undefined,
}));

const heroActions = computed<HeroAction[]>(() =>
  detail.value?.status === 0
    ? [
        { label: '通过', icon: CircleCheck, type: 'primary', emitName: 'approve' },
        { label: '拒绝', icon: CircleClose, type: 'danger', emitName: 'reject' },
      ]
    : [],
);

const timelineItems = computed<AdminTimelineItem[]>(() => {
  const source = detail.value?.timeline ?? [];
  const activeIndex = source.findIndex((item) => !item.time);
  return source.map((item, index) => ({
    key: `${item.event}-${index}`,
    title: item.name,
    time: item.time || undefined,
    state: item.time ? 'done' : index === activeIndex ? 'active' : 'pending',
  }));
});

const resultItems = computed<ResultItem[]>(() => {
  if (!detail.value || detail.value.status === 0) return [];

  const items: ResultItem[] = [];
  if (detail.value.status === 1 && detail.value.credited_at) {
    items.push({ label: '资金入账时间', value: detail.value.credited_at, accent: true });
  }
  if (detail.value.review?.admin_name) {
    items.push({ label: '审核人', value: detail.value.review.admin_name });
  }
  if (detail.value.review?.reviewed_at) {
    items.push({ label: '审核时间', value: detail.value.review.reviewed_at });
  }
  if (detail.value.review?.note) {
    items.push({
      label: detail.value.status === 2 ? '驳回原因' : '审核备注',
      value: detail.value.review.note,
      wide: true,
    });
  }
  return items;
});

const reviewRow = computed<DepositRow | null>(() => {
  if (!detail.value) return null;
  return {
    businessId: detail.value.id,
    id: detail.value.order_no,
    time: detail.value.submitted_at || '—',
    agent: detail.value.user.company_name,
    agentCode: detail.value.user.agent_code,
    asset: detail.value.currency.code,
    network: detail.value.network.code,
    hash: detail.value.txid,
    amount: detail.value.amount,
    status: detail.value.status_name,
    statusCode: detail.value.status,
    statusType: statusType.value,
    statusEffect: detail.value.status === 0 ? 'pending' : undefined,
  };
});

const dialogVisible = ref(false);
const dialogMode = ref<'approve' | 'reject'>('approve');

function goBack() {
  void router.push('/deposit');
}

function openReviewDialog(mode: 'approve' | 'reject') {
  dialogMode.value = mode;
  dialogVisible.value = true;
}

async function handleSubmit(payload: {
  row: DepositRow;
  mode: 'approve' | 'reject';
  reason?: string;
}) {
  await submitReview({
    id: payload.row.businessId,
    decision: payload.mode,
    review_note: payload.mode === 'reject' ? payload.reason?.trim() : undefined,
  });
  ElMessage.success(payload.mode === 'approve' ? '入金审核已通过' : '入金申请已拒绝');
  dialogVisible.value = false;
}

async function copyValue(label: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    ElMessage.success(`${label}已复制`);
  } catch {
    ElMessage.error('复制失败，请手动复制');
  }
}

onMounted(() => {
  const id = Number(route.params.id);
  if (Number.isInteger(id) && id > 0) void loadDetail(id);
});
</script>

<style scoped lang="scss">
.deposit-detail-page {
  gap: 20px;
}

.deposit-core {
  display: grid;
  overflow: hidden;
  grid-template-columns: minmax(320px, 1.1fr) minmax(0, 1fr);
  border: 1px solid #dce7f2;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 14px 34px rgb(15 42 78 / 7%);

  &__amount {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 20px;
    padding: 28px 32px;
    background: linear-gradient(135deg, #f3fffd, #f4f9ff);
  }

  &__icon,
  &__meta article > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    width: 62px;
    height: 62px;
    flex: 0 0 62px;
    border-radius: 18px;
    color: #fff;
    background: linear-gradient(135deg, #19b8a8, #268ee6);
    box-shadow: 0 10px 24px rgb(20 166 174 / 24%);
    font-size: 30px;
  }

  small {
    display: block;
    color: var(--app-text-label);
    font-size: 14px;
    font-weight: 500;
  }

  &__amount p {
    display: flex;
    min-width: 0;
    align-items: baseline;
    gap: 10px;
    margin: 7px 0 5px;
  }

  &__amount strong {
    color: var(--app-text-heading);
    font-size: clamp(30px, 3.2vw, 42px);
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }

  &__amount p span {
    color: #0c8f8b;
    font-size: 16px;
    font-weight: 700;
  }

  &__amount em {
    color: var(--app-text-label);
    font-size: 14px;
    font-style: normal;
  }

  &__meta {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(0, 1.25fr) minmax(185px, 0.75fr);
  }

  &__meta article {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
    padding: 24px;
    border-left: 1px solid #e5ebf2;
  }

  &__meta article > span {
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border-radius: 13px;
    font-size: 22px;

    &.is-purple {
      color: #7457e8;
      background: #f0edff;
    }

    &.is-blue {
      color: #2678da;
      background: #eaf3ff;
    }
  }

  &__meta article div {
    min-width: 0;
  }

  &__meta strong {
    display: block;
    margin-top: 5px;
    color: var(--app-text-body);
    font-size: 16px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  &__meta p {
    margin: 5px 0 0;
    color: var(--app-text-label);
    font-size: 13px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
}

.review-impact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid #bde9e5;
  border-radius: 14px;
  color: #315a5b;
  background: #f1fbfa;

  > span {
    display: inline-flex;
    color: #0aa39e;
    font-size: 20px;
  }

  p {
    margin: 0;
    line-height: 1.6;
  }

  strong {
    margin-right: 10px;
    color: #087f7b;
  }

  b {
    color: #087f7b;
  }
}

.deposit-detail-page__split {
  display: grid;
  min-width: 0;
  align-items: start;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.75fr);
  gap: 20px;
}

.chain-verification__list,
.review-result__grid {
  margin: 0;
  padding: 4px 24px 24px;
}

.chain-verification__list > div {
  padding: 20px 0;
  border-bottom: 1px dashed #dde6f0;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
}

.chain-verification dt,
.review-result dt {
  color: var(--app-text-label);
  font-size: 14px;
  font-weight: 500;
}

.chain-verification dd {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  margin: 10px 0 0;
}

.chain-verification code {
  min-width: 0;
  color: var(--app-text-body);
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 14px;
  line-height: 1.65;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-all;
}

.chain-verification :deep(.el-button) {
  flex: 0 0 auto;
  color: #138f91;
  background: #effafa;
}

.deposit-timeline {
  padding: 24px;
}

.review-result__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 24px;
}

.review-result__grid > div {
  min-width: 0;
  padding: 20px 0;
  border-bottom: 1px dashed #dde6f0;

  &.is-wide {
    grid-column: 1 / -1;
  }
}

.review-result dd {
  margin: 8px 0 0;
  color: var(--app-text-body);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.65;
  overflow-wrap: anywhere;

  &.is-accent {
    color: #078f89;
  }
}

@include narrow {
  .deposit-core {
    grid-template-columns: 1fr;

    &__meta article:first-child {
      border-left: 0;
    }

    &__meta article {
      border-top: 1px solid #e5ebf2;
    }
  }

  .deposit-detail-page__split {
    grid-template-columns: 1fr;
  }
}

@include mobile {
  .deposit-detail-page {
    gap: 16px;
  }

  .deposit-core {
    &__amount {
      align-items: flex-start;
      padding: 22px 18px;
    }

    &__icon {
      width: 50px;
      height: 50px;
      flex-basis: 50px;
      border-radius: 14px;
      font-size: 24px;
    }

    &__meta {
      grid-template-columns: 1fr;
    }

    &__meta article {
      padding: 18px;
      border-left: 0;
    }
  }

  .review-impact {
    align-items: flex-start;
  }

  .chain-verification__list,
  .review-result__grid {
    padding-right: 18px;
    padding-left: 18px;
  }

  .review-result__grid {
    grid-template-columns: 1fr;
  }

  .review-result__grid > div.is-wide {
    grid-column: auto;
  }
}
</style>
