<template>
  <AdminPanel class="flow-business-info">
    <h2>交易信息</h2>

    <div class="flow-business-info__rows">
      <div v-for="row in infoRows" :key="row.label" class="flow-business-info__row">
        <span class="flow-business-info__label">{{ row.label }}</span>
        <div class="flow-business-info__value">
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
import type { FlowDetail } from '../types';

const props = defineProps<{ detail: FlowDetail }>();

const infoRows = computed(() => [
  { label: '交易编号：', value: props.detail.id },
  { label: '代理：', value: props.detail.agent },
  { label: '流水类型：', value: props.detail.flowType },
  { label: '兑换方向：', value: props.detail.direction },
  { label: '支付数量：', value: `${props.detail.payAmount} ${props.detail.payAsset}` },
  { label: '采用比例：', value: props.detail.rate },
  { label: '获得金额：', value: `${props.detail.receiveAmount} ${props.detail.receiveAsset}` },
  { label: '提交时间：', value: props.detail.submittedAt },
  { label: '当前状态：', value: props.detail.status, badge: true },
]);
</script>

<style scoped lang="scss">
.flow-business-info {
  padding: 28px;

  h2 {
    margin: 0 0 24px;
    color: #061936;
    font-size: 24px;
    font-weight: 950;
  }

  &__rows {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 54px;
  }

  &__row {
    display: grid;
    grid-template-columns: 150px minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    min-width: 0;
    padding: 14px 0;
    border-bottom: 1px solid #eef3f9;
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
    gap: 10px;
    color: #061936;
    font-size: 15px;
    font-weight: 850;

    > span:not(.status-badge) {
      min-width: 0;
      overflow-wrap: anywhere;
    }
  }

  @include narrow {
    padding: 22px 24px;

    h2 {
      margin-bottom: 18px;
      font-size: 22px;
    }

    &__rows {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 32px;
    }

    &__row {
      grid-template-columns: 130px minmax(0, 1fr);
      gap: 12px;
    }
  }

  @include mobile {
    padding: 20px;

    h2 {
      font-size: 22px;
    }

    &__rows {
      grid-template-columns: 1fr;
      gap: 0;
    }

    &__row {
      grid-template-columns: 1fr;
      gap: 7px;
    }
  }
}
</style>
