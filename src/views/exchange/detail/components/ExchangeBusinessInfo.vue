<template>
  <AdminPanel class="exchange-business-info">
    <h2>业务信息</h2>

    <div class="exchange-business-info__rows">
      <div v-for="row in infoRows" :key="row.label" class="exchange-business-info__row">
        <span class="exchange-business-info__label">{{ row.label }}</span>
        <div class="exchange-business-info__value">
          <StatusBadge
            v-if="row.badge"
            :label="row.value"
            :type="detail.statusType"
            :effect="detail.statusEffect"
          />
          <span v-else>{{ row.value }}</span>
        </div>
      </div>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { ExchangeDetail } from '../types';

const props = defineProps<{ detail: ExchangeDetail }>();

const infoRows = computed(() => [
  { label: '交易编号：', value: props.detail.id },
  { label: '代理编号：', value: props.detail.agentCode },
  { label: '代理：', value: props.detail.agent },
  { label: '兑换方向：', value: props.detail.direction },
  { label: '支付数量：', value: `${props.detail.payAmount} ${props.detail.payAsset}` },
  { label: '采用比例：', value: props.detail.rate },
  { label: '获得金额：', value: `${props.detail.receiveAmount} ${props.detail.receiveAsset}` },
  { label: '提交时间：', value: props.detail.submittedAt },
  { label: '当前状态：', value: props.detail.status, badge: true },
  { label: '备注：', value: props.detail.remark },
]);
</script>

<style scoped lang="scss">
.exchange-business-info {
  padding: 28px;

  h2 {
    margin: 0 0 24px;
    color: #061936;
    font-size: 24px;
    font-weight: 950;
  }

  &__rows {
    display: grid;
    gap: 0;
  }

  &__row {
    display: grid;
    grid-template-columns: 190px minmax(0, 1fr);
    align-items: center;
    gap: 18px;
    padding: 14px 0;
    border-bottom: 1px solid #eef3f9;

    &:last-child {
      border-bottom: 0;
    }
  }

  &__label {
    color: #66758b;
    font-size: 15px;
    font-weight: 800;
  }

  &__value {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 12px;
    color: #061936;
    font-size: 16px;
    font-weight: 850;

    > span:not(.status-badge) {
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
  }

  @include narrow {
    padding: 22px 24px;

    h2 {
      margin-bottom: 18px;
      font-size: 22px;
    }

    &__row {
      grid-template-columns: 150px minmax(0, 1fr);
      gap: 14px;
    }

    &__label {
      font-size: 14px;
    }

    &__value {
      font-size: 15px;
    }
  }

  @include mobile {
    padding: 20px;

    h2 {
      font-size: 20px;
      margin-bottom: 16px;
    }

    &__row {
      grid-template-columns: 1fr;
      gap: 8px;
      padding-bottom: 14px;

      &:last-child {
        padding-bottom: 0;
      }
    }

    &__value {
      flex-wrap: wrap;
      font-size: 14px;
      gap: 10px;
    }
  }
}
</style>
