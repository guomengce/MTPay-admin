<template>
  <AdminPanel title="目前设定" :icon="Setting">
    <template #extra>
      <RouterLink class="text-link" to="/fee">管理</RouterLink>
    </template>
    <dl class="settings-list">
      <div>
        <dt>USDT 预设比例</dt>
        <dd>0.9900</dd>
      </div>
      <div>
        <dt>USDC 预设比例</dt>
        <dd>0.9900</dd>
      </div>
      <div>
        <dt>固定出金费</dt>
        <dd>50.00 USD</dd>
      </div>
    </dl>
  </AdminPanel>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';
</script>

<style scoped lang="scss">
.settings-list {
  display: grid;
  margin: 0;
  padding: 18px 28px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #e6edf5;
  }

  div:last-child {
    border-bottom: 0;
  }

  dt {
    color: #394862;
    font-weight: 850;
  }

  dd {
    margin: 0;
    color: #071833;
    font-weight: 900;
  }
}
</style>
