<template>
  <section class="admin-page whitelist-detail-page">
    <WhitelistDetailHero
      :detail="detail"
      @back="goBack"
      @approve="openReviewDialog('approve')"
      @reject="openReviewDialog('reject')"
    />
    <WhitelistSummaryCards :detail="detail" />

    <div class="whitelist-detail-page__grid">
      <main class="whitelist-detail-page__main">
        <WhitelistInfoPanel :detail="detail" />
        <WhitelistReviewRemark :detail="detail" />
      </main>

      <aside class="whitelist-detail-page__aside">
        <WhitelistTimeline :detail="detail" />
      </aside>
    </div>

    <WhitelistAddDialog
      v-model="dialogVisible"
      :row="reviewRow"
      :mode="dialogMode"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import WhitelistAddDialog from '../components/WhitelistAddDialog.vue';
import type { WhitelistRow } from '../components/WhitelistTableList.vue';
import WhitelistDetailHero from './components/WhitelistDetailHero.vue';
import WhitelistInfoPanel from './components/WhitelistInfoPanel.vue';
import WhitelistReviewRemark from './components/WhitelistReviewRemark.vue';
import WhitelistSummaryCards from './components/WhitelistSummaryCards.vue';
import WhitelistTimeline from './components/WhitelistTimeline.vue';
import type { WhitelistDetail } from './types';

const route = useRoute();
const router = useRouter();

const detail = computed<WhitelistDetail>(() => {
  const id = String(route.params.id || 'WL-1005');

  return {
    id,
    title: '白名单详情',
    description: '核对收付款主体、银行资料与审核风险',
    status: '待审核',
    statusType: 'warning',
    statusEffect: 'pending',
    subjectName: 'Atlas Commerce GmbH',
    role: '收款人',
    subjectType: '企业（B）',
    agent: '代理A · Apex Trading',
    country: 'Germany',
    city: 'Berlin',
    address: '18 Friedrichstrasse, Berlin',
    bankName: 'Deutsche Bank',
    iban: 'DE8937040044053206194',
    swift: 'DEUTDEBB',
    intermediarySwift: '—',
    purpose: 'Agency Commissions',
    remark: 'Service payment',
    submittedAt: '2026/08/10 16:39:26',
    reviewRemark: '等待 MTPay 后台审核',
    timeline: [
      {
        key: 'submit',
        title: '代理提交白名单资料',
        time: '2026/08/10 16:39:26',
        state: 'done',
      },
      {
        key: 'reviewing',
        title: '等待后台审核',
        state: 'active',
      },
      {
        key: 'done',
        title: '审核通过 / 拒绝',
        state: 'pending',
      },
    ],
  };
});

const reviewRow = computed<WhitelistRow>(() => ({
  id: detail.value.id,
  time: '08/03 15:38',
  agent: detail.value.agent,
  type: `${detail.value.role} · B`,
  subject: detail.value.subjectName,
  country: detail.value.country,
  bank: detail.value.bankName,
  account: detail.value.iban,
  status: detail.value.status,
  statusType: 'warning',
  statusEffect: 'pending',
}));

const dialogVisible = ref(false);
const dialogMode = ref<'approve' | 'reject'>('approve');

function goBack() {
  router.push('/whitelist');
}

function openReviewDialog(mode: 'approve' | 'reject') {
  dialogMode.value = mode;
  dialogVisible.value = true;
}

function handleSubmit(payload: { row: WhitelistRow; mode: 'approve' | 'reject'; reason?: string }) {
  // 接入 API：await api.whitelist.review(payload)
  console.log('whitelist detail review', payload);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
.whitelist-detail-page {
  gap: 20px;

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 24px;
    align-items: start;
  }

  &__main,
  &__aside {
    display: grid;
    gap: 20px;
    min-width: 0;
  }

  @include narrow {
    &__grid {
      grid-template-columns: minmax(0, 1fr) 300px;
      gap: 18px;
    }

    &__main,
    &__aside {
      gap: 18px;
    }
  }

  @include mobile {
    gap: 14px;

    &__grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    &__main,
    &__aside {
      gap: 14px;
    }
  }
}
</style>
