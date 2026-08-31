<template>
  <section class="admin-page deposit-detail-page">
    <template v-if="detail">
      <DetailHero
        compact
        order="訂單號"
        title="入金詳情"
        :order-id="detail.order_no"
        :status="heroStatus"
        @back="goBack"
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
            :platform-transaction-no="detail.safeheron_tx_key"
            :source-address="detail.source_address_snapshot"
            :receiving-address="detail.receiving_address_snapshot"
            @copy="copyValue"
          />
        </div>
        <Timeline :items="timelineItems" />
      </div>
    </template>
    <el-empty v-else-if="!loading" description="未找到入金订单" />
  </section>
</template>

<script setup lang="ts">
/** 管理端入金详情：展示订单、链上资料与处理时间线。 */
import { computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';

import DetailHero from '@/components/detail/DetailHero.vue';
import { usePageLoading } from '@/composables/usePageLoading';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';

import ChainVerification from './components/ChainVerification.vue';
import CoreCard from './components/CoreCard.vue';
import Timeline from './components/Timeline.vue';
import { useDepositDetail } from '../composables/useDepositDetail';

const route = useRoute();
const router = useRouter();
const { detail, loading, loadDetail } = useDepositDetail();
usePageLoading(loading);

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

function goBack() { router.go(-1); }

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

    &__split {
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
    }

    &__split-col {
      gap: 16px;
    }
  }
}
</style>
