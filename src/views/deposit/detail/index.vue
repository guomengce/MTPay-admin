<template>
  <section v-loading="loading" class="admin-page deposit-detail-page">
    <template v-if="detail">
      <DetailHero
        compact
        order="订单号"
        title="入金审核"
        description="核对链上凭证与申报金额后完成审核"
        :order-id="detail.order_no"
        :status="heroStatus"
        :actions="heroActions"
        @back="goBack"
        @approve="openReviewDialog('approve')"
        @reject="openReviewDialog('reject')"
      />

      <!-- 核心信息（金额 + 代理 + 提交时间） -->
      <CoreCard
        :amount="detail.amount"
        :currency="detail.currency"
        :network="detail.network"
        :user="detail.user"
        :submitted-at="detail.submitted_at"
      />

      <!-- 链上核验 / 入账结果 + 处理时间线 -->
      <div class="deposit-detail-page__split">
        <div class="deposit-detail-page__split-col">
          <ChainVerification
            :txid="detail.txid"
            :receiving-address="detail.receiving_address_snapshot"
            @copy="copyValue"
          />
          <!-- 审核结果 -->
          <ReviewResult :items="resultItems" />
        </div>
        <Timeline :items="timelineItems" />
      </div>

      <!-- 审核弹框（通过 / 驳回） -->
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
/** 管理端入金审核详情：组合 4 个区块组件 + 审核弹框，所有展示模型来自详情接口。 */
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';

import DepositAddDialog from '../components/DepositAddDialog.vue';
import ChainVerification from './components/ChainVerification.vue';
import CoreCard from './components/CoreCard.vue';
import ReviewResult, {
  type ReviewResultItem,
} from './components/ReviewResult.vue';
import Timeline from './components/Timeline.vue';
import type { DepositRow } from '../composables/mapper';
import { useDepositDetail } from '../composables/useDepositDetail';

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

const resultItems = computed<ReviewResultItem[]>(() => {
  if (!detail.value || detail.value.status === 0) return [];

  const items: ReviewResultItem[] = [];
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
  .deposit-detail-page__split {
    grid-template-columns: 1fr;
  }
}

@include mobile {
  .deposit-detail-page {
    gap: 16px;
  }
}
</style>