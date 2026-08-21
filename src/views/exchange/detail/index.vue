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

      <!-- 核心信息（兑换流程 + 代理 + 提交时间） -->
      <ExchangeOverviewCard
        :source-amount="detail.source_amount"
        :source-currency="detail.source_currency"
        :target-amount="detail.target_amount"
        :target-currency="detail.target_currency"
        :exchange-rate="detail.exchange_rate"
        :rate-source-name="detail.rate_source_name"
        :user="detail.user"
        :submitted-at="detail.submitted_at"
      />

      <!-- 兑换依据 / 兑换结果 + 处理时间线 -->
      <div class="exchange-detail-page__split">
        <div class="exchange-detail-page__split-col">
          <!-- 审核结果 -->
          <ReviewResult :items="resultItems" />
        </div>
        <Timeline :items="timelineItems" />
      </div>

      <!-- 审核弹框（通过 / 驳回） -->
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
/** 管理端兑换审核详情：组合 4 个区块组件 + 审核弹框，所有展示模型来自详情接口。 */
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';

import ExchangeAddDialog from '../components/ExchangeAddDialog.vue';
import ExchangeOverviewCard from './components/ExchangeOverviewCard.vue';
import ReviewResult, {
  type ReviewResultItem,
} from './components/ReviewResult.vue';
import Timeline from './components/Timeline.vue';
import type { ExchangeRow } from '../composables/mapper';
import { useExchangeDetail } from '../composables/useExchangeDetail';

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

const resultItems = computed<ReviewResultItem[]>(() => {
  if (!detail.value || detail.value.status === 0) return [];

  const items: ReviewResultItem[] = [];
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
    usd: detail.value.target_amount,
    toSymbol: detail.value.target_currency.code,
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

  &__split {
    display: grid;
    min-width: 0;
    align-items: start;
    grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.75fr);
    gap: 20px;
  }

  &__split-col {
    display: grid;
    min-width: 0;
    gap: 20px;
  }
}

@include narrow {
  .exchange-detail-page__split {
    grid-template-columns: 1fr;
  }
}

@include mobile {
  .exchange-detail-page {
    gap: 16px;
  }
}
</style>
