<template>
  <section v-loading="loading" class="admin-page transaction-detail-page">
    <div class="transaction-detail-page__toolbar">
      <el-button plain :icon="ArrowLeft" @click="goBack">返回交易记录</el-button>
      <span class="transaction-detail-page__notice">
        <el-icon><InfoFilled /></el-icon>
        交易记录仅只读，审核、补件与付款等操作请进入对应业务模块
      </span>
    </div>

    <template v-if="info">
      <TransactionDetailSummary :transaction="info.transaction" />
      <TransactionDetailBusiness :business-type="info.transaction.business_type" :detail="info.detail" />
    </template>
    <el-empty v-else-if="!loading" description="未找到该交易记录" />
  </section>
</template>

<script setup lang="ts">
/** 统一交易详情（只读）：列表详情按钮带入 detail_type / detail_id。 */
import { onMounted, ref } from 'vue';
import { ArrowLeft, InfoFilled } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import * as TransactionApi from '@/api/modules/transaction';
import type { TransactionInfoResult } from '@/api/modules/transaction';
import TransactionDetailBusiness from '../components/TransactionDetailBusiness.vue';
import TransactionDetailSummary from '../components/TransactionDetailSummary.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const info = ref<TransactionInfoResult | null>(null);

function goBack() {
  void router.push('/transactions');
}

onMounted(async () => {
  const businessType = route.params.businessType as 'deposit' | 'exchange' | 'withdrawal';
  const businessId = Number(route.params.businessId);
  if (!businessType || !Number.isInteger(businessId) || businessId <= 0) return;
  loading.value = true;
  try {
    info.value = await TransactionApi.fetchTransactionInfo({
      business_type: businessType,
      business_id: businessId,
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
.transaction-detail-page {
  gap: 20px;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__notice {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--app-text-label);
    font-size: 12px;

    .el-icon {
      color: #0aa39e;
    }
  }

  @include mobile {
    &__toolbar {
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style>
