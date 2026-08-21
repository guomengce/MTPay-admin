<template>
  <AdminPanel title="申请代理" subtitle="本次出金订单所属的代理账户" :icon="UserFilled">
    <div class="order-info">
      <article class="order-info__cell is-agent">
        <span class="order-info__icon"><el-icon><UserFilled /></el-icon></span>
        <div class="order-info__body">
          <small>申请代理</small>
          <strong>{{ agentCompany }}</strong>
          <p>{{ agentCode }} · {{ agentEmail }}</p>
        </div>
      </article>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';

defineProps<{
  agentCompany: string;
  agentCode: string;
  agentEmail: string;
}>();
</script>

<style scoped lang="scss">
.order-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  padding: 20px 24px 24px;

  &__cell {
    display: flex;
    min-width: 0;
    align-items: flex-start;
    gap: 12px;
    align-items: center;
    padding: 14px 16px;
    border: 1px solid #e0e8f0;
    border-radius: 14px;
    background: #fbfcfe;
  }

  &__icon {
    display: inline-flex;
    width: 40px;
    height: 40px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    font-size: 19px;
    color: #7457e8;
    background: #f0edff;

  }

  &__body { min-width: 0; }

  small { color: var(--app-text-label); font-size: 12px; }

  strong {
    display: block;
    margin-top: 6px;
    color: var(--app-text-body);
    font-size: 15px;
    overflow-wrap: anywhere;
  }

  p {
    margin: 5px 0 0;
    color: var(--app-text-label);
    font-size: 12px;
    overflow-wrap: anywhere;
  }
}

@include mobile {
  .order-info {
    grid-template-columns: 1fr;
    padding: 16px;

  }
}
</style>
