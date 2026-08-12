<template>
  <AdminPanel class="withdrawal-business-info">
    <h2>业务信息</h2>

    <section
      v-for="section in sections"
      :key="section.title"
      class="withdrawal-business-info__section"
    >
      <h3>
        <span>
          <component :is="section.icon" />
        </span>
        {{ section.title }}
      </h3>

      <div class="withdrawal-business-info__fields">
        <div
          v-for="field in section.fields"
          :key="field.label"
          class="withdrawal-business-info__field"
        >
          <span class="withdrawal-business-info__label">{{ field.label }}</span>
          <div class="withdrawal-business-info__value">
            <StatusBadge
              v-if="field.badge"
              :label="field.value"
              :type="detail.statusType"
              :effect="detail.statusEffect"
            />
            <span v-else>{{ field.value }}</span>
          </div>
        </div>
      </div>
    </section>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Money, Tickets, UserFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { WithdrawalDetail } from '../types';

const props = defineProps<{ detail: WithdrawalDetail }>();

const sections = computed(() => [
  {
    title: '基础信息',
    icon: Tickets,
    fields: [
      { label: '交易编号：', value: props.detail.id },
      { label: '当前状态：', value: props.detail.status, badge: true },
      { label: '所属代理：', value: props.detail.agent },
      { label: '付款参考号：', value: props.detail.reference },
    ],
  },
  {
    title: '收付款信息',
    icon: UserFilled,
    fields: [
      { label: '付款人：', value: props.detail.payer },
      { label: '收款金额：', value: `${props.detail.receiveAmount} ${props.detail.currency}` },
      { label: '收款人：', value: props.detail.payee },
      { label: '总扣款：', value: `${props.detail.totalDebit} ${props.detail.currency}` },
    ],
  },
  {
    title: '费用与要求',
    icon: Money,
    fields: [
      { label: '固定手续费：', value: `${props.detail.fixedFee} ${props.detail.currency}` },
      { label: '佐证文件要求：', value: props.detail.documentRequirement },
    ],
  },
]);
</script>

<style scoped lang="scss">
.withdrawal-business-info {
  padding: 28px;

  h2 {
    margin: 0 0 24px;
    color: #061936;
    font-size: 24px;
    font-weight: 950;
  }

  &__section {
    padding: 22px 0;
    border-top: 1px solid #eef3f9;

    &:first-of-type {
      padding-top: 0;
      border-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 18px;
    color: #079d96;
    font-size: 17px;
    font-weight: 950;

    span {
      display: inline-flex;
      width: 24px;
      height: 24px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgb(57 245 236 / 14%);
      font-size: 16px;
    }
  }

  &__fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 54px;
  }

  &__field {
    display: grid;
    grid-template-columns: 150px minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    min-width: 0;
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

    h3 {
      font-size: 16px;
    }

    &__fields {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px 32px;
    }

    &__field {
      grid-template-columns: 130px minmax(0, 1fr);
      gap: 12px;
    }
  }

  @include mobile {
    padding: 20px;

    h2 {
      font-size: 22px;
    }

    &__fields {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    &__field {
      grid-template-columns: 1fr;
      gap: 7px;
    }
  }
}
</style>
