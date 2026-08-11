<template>
  <div class="metric-grid">
    <MetricCard label="正常代理" value="2" subtext="后台直接建立" :icon="UserFilled" />
    <MetricCard
      label="待审核入金 / 兑换"
      value="2"
      subtext="1 入金 · 1 兑换"
      :icon="RefreshRight"
      tone="blue"
    />
    <MetricCard
      label="白名单 / 出金待办"
      value="1"
      subtext="1 白名单 · 0 出金"
      :icon="Tickets"
      tone="purple"
    />
    <MetricCard
      label="出金手续费"
      value="100.00"
      subtext="已处理订单"
      :icon="Coin"
      tone="amber"
    />
  </div>
</template>

<script setup lang="ts">
import { Coin, RefreshRight, Tickets, UserFilled } from '@element-plus/icons-vue';

import MetricCard from '@/components/admin/MetricCard.vue';
</script>
