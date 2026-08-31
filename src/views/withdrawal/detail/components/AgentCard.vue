<template>
  <AdminPanel title="申請代理" :icon="UserFilled">
    <div class="order-info">
      <div><small>代理名稱</small><strong>{{ agentCompany }}</strong></div>
      <div><small>聯絡郵箱</small><strong>{{ agentEmail }}</strong></div>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';

defineProps<{
  agentCompany: string;
  agentEmail: string;
}>();
</script>

<style scoped lang="scss">
.order-info {
  display: grid;
  padding: 10px 18px 16px;
  grid-template-columns: 1fr;

  > div {
    display: grid;
    min-width: 0;
    gap: 5px;
    padding: 9px 2px;
    border-bottom: 1px solid #e1e8ef;
  }
  > div:last-child { border-bottom: 0; }

  small { color: var(--app-text-label); font-size: 12px; }

  strong {
    color: var(--app-text-body);
    font-size: 15px;
    overflow-wrap: anywhere;
  }

}

@include mobile {
  .order-info {
    grid-template-columns: 1fr;
    padding: 16px;
    > div { padding: 10px 0; border-bottom: 1px solid #e1e8ef; }
    > div:last-child { border-bottom: 0; }
  }
}
</style>
