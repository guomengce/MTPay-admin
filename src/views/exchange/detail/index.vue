<template>
  <section v-loading="loading" class="admin-page exchange-detail-page">
    <template v-if="detail">
      <DetailHero
        compact
        order="订单号"
        title="数字货币兑换审核"
        description="核对冻结资金与提交时的汇率快照后完成审核"
        :order-id="detail.order_no"
        :status="heroStatus"
        :actions="heroActions"
        @back="goBack"
        @approve="openReviewDialog('approve')"
        @reject="openReviewDialog('reject')"
      />

      <section class="exchange-overview">
        <div class="exchange-overview__flow">
          <article class="exchange-asset is-source">
            <small>支付资产</small>
            <p>
              <strong>{{ detail.source_amount }}</strong>
              <span>{{ detail.source_currency.code }}</span>
            </p>
            <em>{{ detail.source_currency.name }}</em>
          </article>

          <div class="exchange-rate">
            <span>
              <el-icon><Right /></el-icon>
            </span>
            <small>提交时汇率</small>
            <strong>
              1 {{ detail.source_currency.code }} = {{ detail.exchange_rate }}
              {{ detail.target_currency.code }}
            </strong>
            <em>{{ detail.rate_source_name }}</em>
          </div>

          <article class="exchange-asset is-target">
            <small>预计到账</small>
            <p>
              <strong>{{ detail.target_amount }}</strong>
              <span>{{ detail.target_currency.code }}</span>
            </p>
            <em>{{ detail.target_currency.name }}</em>
          </article>
        </div>

        <div class="exchange-overview__meta">
          <article>
            <span class="is-purple">
              <el-icon><UserFilled /></el-icon>
            </span>
            <div>
              <small>申请代理</small>
              <strong>{{ detail.user.company_name }}</strong>
              <p>{{ detail.user.agent_code }} · {{ detail.user.email }}</p>
            </div>
          </article>
          <article>
            <span class="is-blue">
              <el-icon><Calendar /></el-icon>
            </span>
            <div>
              <small>提交时间</small>
              <strong>{{ detail.submitted_at || '—' }}</strong>
            </div>
          </article>
        </div>
      </section>

      <div v-if="detail.status === 0" class="review-impact">
        <span>
          <el-icon><InfoFilled /></el-icon>
        </span>
        <p>
          <strong>审核影响</strong>
          通过后扣除已冻结的
          <b>{{ detail.source_amount }} {{ detail.source_currency.code }}</b>
          并增加
          <b>{{ detail.target_amount }} {{ detail.target_currency.code }}</b>
          可用余额；拒绝后释放来源资产。
        </p>
      </div>

      <div class="exchange-detail-page__split">
        <AdminPanel
          class="exchange-evidence"
          title="兑换依据"
          subtitle="订单始终使用提交时保存的汇率，不受后续费率调整影响"
          :icon="TrendCharts"
        >
          <dl class="exchange-evidence__grid">
            <div>
              <dt>汇率快照</dt>
              <dd>
                1 {{ detail.source_currency.code }} = {{ detail.exchange_rate }}
                {{ detail.target_currency.code }}
              </dd>
            </div>
            <div>
              <dt>汇率来源</dt>
              <dd>{{ detail.rate_source_name }}</dd>
            </div>
            <div>
              <dt>来源资金冻结时间</dt>
              <dd>{{ detail.frozen_at || '—' }}</dd>
            </div>
          </dl>
        </AdminPanel>

        <AdminPanel v-if="timelineItems.length" class="exchange-timeline">
          <AdminTimeline title="处理时间线" :items="timelineItems" />
        </AdminPanel>
      </div>

      <AdminPanel
        v-if="resultItems.length"
        class="review-result"
        :title="detail.status === 1 ? '兑换结果' : '驳回结果'"
        :subtitle="detail.status === 1 ? '审核完成后的兑换处理记录' : '本次兑换未通过审核'"
        :icon="detail.status === 1 ? CircleCheck : CircleClose"
      >
        <dl class="review-result__grid">
          <div v-for="item in resultItems" :key="item.label" :class="{ 'is-wide': item.wide }">
            <dt>{{ item.label }}</dt>
            <dd :class="{ 'is-accent': item.accent }">{{ item.value }}</dd>
          </div>
        </dl>
      </AdminPanel>

      <ExchangeAddDialog
        v-model="dialogVisible"
        :row="reviewRow"
        :mode="dialogMode"
        :submitting="reviewing"
        @submit="handleSubmit"
      />
    </template>

    <el-empty v-else-if="!loading" description="未找到兑换订单" />
  </section>
</template>

<script setup lang="ts">
/** 管理端兑换审核详情：直接使用接口详情对象，界面不拼装假字段。 */
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Calendar,
  CircleCheck,
  CircleClose,
  InfoFilled,
  Right,
  TrendCharts,
  UserFilled,
} from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';

import ExchangeAddDialog from '../components/ExchangeAddDialog.vue';
import type { ExchangeRow } from '../composables/mapper';
import { useExchangeDetail } from '../composables/useExchangeDetail';

interface ResultItem {
  label: string;
  value: string;
  wide?: boolean;
  accent?: boolean;
}

const route = useRoute();
const router = useRouter();
const { detail, loading, reviewing, loadDetail, submitReview } = useExchangeDetail();

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
  if (detail.value.status === 1 && detail.value.completed_at) {
    items.push({ label: '兑换完成时间', value: detail.value.completed_at, accent: true });
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

const reviewRow = computed<ExchangeRow | null>(() => {
  if (!detail.value) return null;
  return {
    businessId: detail.value.id,
    id: detail.value.order_no,
    time: detail.value.submitted_at || '—',
    agent: detail.value.user.company_name,
    code: detail.value.user.agent_code,
    amount: detail.value.source_amount,
    asset: detail.value.source_currency.code,
    rate: detail.value.exchange_rate,
    rateSource: detail.value.rate_source_name,
    usd: `${detail.value.target_amount} ${detail.value.target_currency.code}`,
    status: detail.value.status_name,
    statusCode: detail.value.status,
    statusType: statusType.value,
    statusEffect: detail.value.status === 0 ? 'pending' : undefined,
  };
});

const dialogVisible = ref(false);
const dialogMode = ref<'approve' | 'reject'>('approve');

function goBack() {
  void router.push('/exchange');
}

function openReviewDialog(mode: 'approve' | 'reject') {
  dialogMode.value = mode;
  dialogVisible.value = true;
}

async function handleSubmit(payload: {
  row: ExchangeRow;
  mode: 'approve' | 'reject';
  reason?: string;
}) {
  await submitReview({
    id: payload.row.businessId,
    decision: payload.mode,
    review_note: payload.mode === 'reject' ? payload.reason?.trim() : undefined,
  });
  ElMessage.success(payload.mode === 'approve' ? '兑换审核已通过' : '兑换申请已拒绝');
  dialogVisible.value = false;
}

onMounted(() => {
  const id = Number(route.params.id);
  if (Number.isInteger(id) && id > 0) void loadDetail(id);
});
</script>

<style scoped lang="scss">
.exchange-detail-page {
  gap: 20px;
}

.exchange-overview {
  overflow: hidden;
  border: 1px solid #dce7f2;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 14px 34px rgb(15 42 78 / 7%);

  &__flow {
    display: grid;
    align-items: stretch;
    grid-template-columns: minmax(0, 1fr) minmax(230px, 0.65fr) minmax(0, 1fr);
  }

  &__meta {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(240px, 0.65fr);
    border-top: 1px solid #e4ebf3;
  }

  &__meta article {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
    padding: 18px 28px;

    + article {
      border-left: 1px solid #e4ebf3;
    }

    > span {
      display: inline-flex;
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      font-size: 21px;

      &.is-purple {
        color: #7457e8;
        background: #f0edff;
      }

      &.is-blue {
        color: #2678da;
        background: #eaf3ff;
      }
    }

    div {
      min-width: 0;
    }

    small {
      display: block;
      color: var(--app-text-label);
      font-size: 13px;
    }

    strong {
      display: block;
      margin-top: 4px;
      color: var(--app-text-body);
      font-size: 15px;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    p {
      margin: 4px 0 0;
      color: var(--app-text-label);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
  }
}

.exchange-asset {
  min-width: 0;
  padding: 30px 32px;

  &.is-source {
    background: linear-gradient(135deg, #f4fbff, #f7faff);
  }

  &.is-target {
    text-align: right;
    background: linear-gradient(135deg, #f5fffc, #effbf8);
  }

  small,
  em {
    display: block;
    color: var(--app-text-label);
    font-size: 14px;
    font-style: normal;
  }

  p {
    display: flex;
    min-width: 0;
    align-items: baseline;
    gap: 10px;
    margin: 10px 0 7px;
  }

  &.is-target p {
    justify-content: flex-end;
  }

  strong {
    color: var(--app-text-heading);
    font-size: clamp(30px, 3vw, 42px);
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }

  p span {
    color: #078f89;
    font-size: 16px;
    font-weight: 700;
  }
}

.exchange-rate {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 22px 18px;
  text-align: center;
  background: #fff;

  > span {
    display: inline-flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    border-radius: 50%;
    color: #fff;
    background: linear-gradient(135deg, #19b8a8, #268ee6);
    box-shadow: 0 8px 20px rgb(20 166 174 / 22%);
    font-size: 22px;
  }

  small,
  em {
    color: var(--app-text-label);
    font-size: 13px;
    font-style: normal;
  }

  strong {
    margin: 5px 0;
    color: var(--app-text-body);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
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

.exchange-detail-page__split {
  display: grid;
  min-width: 0;
  align-items: start;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.75fr);
  gap: 20px;
}

.exchange-evidence__grid,
.review-result__grid {
  display: grid;
  margin: 0;
  padding: 4px 24px 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 24px;
}

.exchange-evidence__grid > div,
.review-result__grid > div {
  min-width: 0;
  padding: 20px 0;
  border-bottom: 1px dashed #dde6f0;
}

.exchange-evidence dt,
.review-result dt {
  color: var(--app-text-label);
  font-size: 14px;
  font-weight: 500;
}

.exchange-evidence dd,
.review-result dd {
  margin: 8px 0 0;
  color: var(--app-text-body);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.review-result__grid > div.is-wide {
  grid-column: 1 / -1;
}

.review-result dd.is-accent {
  color: #078f89;
}

.exchange-timeline {
  padding: 24px;
}

@include narrow {
  .exchange-overview {
    &__flow {
      grid-template-columns: minmax(0, 1fr) 190px minmax(0, 1fr);
    }

    &__meta {
      grid-template-columns: 1fr 1fr;
    }
  }

  .exchange-detail-page__split {
    grid-template-columns: 1fr;
  }
}

@include mobile {
  .exchange-detail-page {
    gap: 16px;
  }

  .exchange-overview {
    &__flow,
    &__meta {
      grid-template-columns: 1fr;
    }

    &__meta article + article {
      border-top: 1px solid #e4ebf3;
      border-left: 0;
    }

    &__meta article {
      padding: 17px 18px;
    }
  }

  .exchange-asset {
    padding: 23px 20px;

    &.is-target {
      text-align: left;
    }

    &.is-target p {
      justify-content: flex-start;
    }
  }

  .exchange-rate {
    padding: 16px 18px;
    border-top: 1px solid #e4ebf3;
    border-bottom: 1px solid #e4ebf3;
  }

  .review-impact {
    align-items: flex-start;
  }

  .exchange-evidence__grid,
  .review-result__grid {
    padding-right: 18px;
    padding-left: 18px;
    grid-template-columns: 1fr;
  }

  .review-result__grid > div.is-wide {
    grid-column: auto;
  }
}
</style>
