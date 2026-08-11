<template>
  <section class="admin-page">
    <AdminHero
      title="比例与费用"
      description="下方配置将直接影响代理专属费率与帐金额，请谨慎设定。"
      :icon="PieChart"
    />

    <div class="fee-grid">
      <FeeRateForm />
      <FeeWithdrawalForm />
    </div>

    <FeeAgentTable />
  </section>
</template>

<script setup lang="ts">
import { PieChart } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import FeeAgentTable from './components/FeeAgentTable.vue';
import FeeRateForm from './components/FeeRateForm.vue';
import FeeWithdrawalForm from './components/FeeWithdrawalForm.vue';
</script>

<style scoped lang="scss">
.fee-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

@include mobile {
  .fee-grid {
    grid-template-columns: 1fr;
  }
}
</style>
