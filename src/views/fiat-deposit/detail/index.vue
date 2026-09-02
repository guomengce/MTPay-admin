<template>
  <section class="admin-page fiat-detail-page">
    <template v-if="detail">
      <DetailHero
        compact
        order="訂單號"
        title="法幣入金審核"
        description="核對匯款資料與銀行憑證後完成審核"
        :order-id="detail.order_no"
        :status="heroStatus"
        :actions="heroActions"
        @back="router.go(-1)"
        @approve="openReview('approve')"
        @reject="openReview('reject')"
      />

      <FiatCoreCard
        :amount="detail.amount"
        :currency="detail.currency"
        :user="detail.user"
        :submitted-at="detail.submitted_at"
      />

      <div class="fiat-detail-page__split">
        <RemittancePanel
          :detail="detail"
          @preview="openFile"
          @download="saveFile"
        />
        <Timeline :items="timelineItems" />
      </div>

      <ReviewActions
        v-model="reviewVisible"
        :mode="reviewMode"
        :submitting="submitting"
        @review="review"
      />
    </template>
    <el-empty v-else-if="!loading" description="未找到法幣入金訂單" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import { usePageLoading } from '@/composables/usePageLoading';
import { usePermission } from '@/composables/usePermission';
import {
  downloadFiatFile,
  fetchFiatDetail,
  previewFiatFile,
  reviewFiatDeposit,
  type FiatOrderDetail,
} from '@/api/modules/fiatDeposit';
import Timeline from '@/views/deposit/detail/components/Timeline.vue';
import FiatCoreCard from './components/FiatCoreCard.vue';
import RemittancePanel from './components/RemittancePanel.vue';
import ReviewActions from './components/ReviewActions.vue';

const route = useRoute();
const router = useRouter();
const { canOperate } = usePermission();
const detail = ref<FiatOrderDetail>();
const loading = ref(false);
const submitting = ref(false);
const reviewVisible = ref(false);
const reviewMode = ref<'approve' | 'reject'>('approve');
usePageLoading(loading);

const statusType = computed<StatusBadgeType>(() => detail.value?.status === 1 ? 'success' : detail.value?.status === 2 ? 'danger' : 'warning');
const heroStatus = computed(() => ({ label: detail.value?.status_name || '未知狀態', type: statusType.value, effect: detail.value?.status === 0 ? ('pending' as const) : undefined }));
const heroActions = computed<HeroAction[]>(() => detail.value?.status === 0 && canOperate('fiatDeposits.review') ? [
  { label: '審核通過', icon: CircleCheck, type: 'primary', emitName: 'approve' },
  { label: '審核拒絕', icon: CircleClose, type: 'danger', emitName: 'reject' },
] : []);
const timelineItems = computed<AdminTimelineItem[]>(() => {
  const source = detail.value?.timeline ?? [];
  const activeIndex = source.findIndex((item) => !item.time);
  return source.map((item, index) => ({ key: `${item.event}-${index}`, title: item.name, time: item.time || undefined, state: item.time ? 'done' : index === activeIndex ? 'active' : 'pending' }));
});

async function load() {
  loading.value = true;
  try { detail.value = await fetchFiatDetail(Number(route.params.id)); }
  finally { loading.value = false; }
}
function openReview(mode: 'approve' | 'reject') { reviewMode.value = mode; reviewVisible.value = true; }
function useBlob(blob: Blob, name?: string) {
  const url = URL.createObjectURL(blob);
  if (name) { const link = document.createElement('a'); link.href = url; link.download = name; link.click(); }
  else window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function openFile(id: number) { useBlob(await previewFiatFile(id)); }
async function saveFile(id: number, name: string) { useBlob(await downloadFiatFile(id), name); }
async function review(value: { decision: 'approve' | 'reject'; review_note?: string }) {
  if (!detail.value) return;
  submitting.value = true;
  try {
    detail.value = await reviewFiatDeposit({ id: detail.value.id, ...value });
    reviewVisible.value = false;
    ElMessage.success(value.decision === 'approve' ? '法幣入金審核已通過' : '法幣入金申請已拒絕');
  } finally { submitting.value = false; }
}

onMounted(() => {
  const id = Number(route.params.id);
  if (Number.isInteger(id) && id > 0) void load();
});
</script>

<style scoped lang="scss">
.fiat-detail-page {
  gap: 20px;
  &__split { display: grid; min-width: 0; align-items: start; grid-template-columns: minmax(0, 1.65fr) minmax(280px, .75fr); gap: 20px; }
}
@include narrow { .fiat-detail-page__split { grid-template-columns: 1fr; } }
@include mobile { .fiat-detail-page { gap: 16px; &__split { grid-template-columns: minmax(0, 1fr); gap: 16px; } } }
</style>