<template>
  <AdminPanel title="预设兑换比例" subtitle="设定预设的币种兑换比例" :icon="TrendCharts">
    <el-form class="settings-form" :model="rateForm" label-position="top">
      <div class="form-grid">
        <el-form-item label="USDT → USD" prop="defaultUsdt">
          <el-input-number v-model="rateForm.defaultUsdt" :step="0.01" :precision="2" />
        </el-form-item>
        <el-form-item label="USDC → USD" prop="defaultUsdc">
          <el-input-number v-model="rateForm.defaultUsdc" :step="0.01" :precision="2" />
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary">储存预设比例</el-button>
  </AdminPanel>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { TrendCharts } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';

const rateForm = reactive({
  defaultUsdt: 0.99,
  defaultUsdc: 0.99,
});
</script>

<style scoped lang="scss">
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 24px 28px 12px;
}

.settings-form {
  :deep(.el-form-item__label) {
    color: #263854;
    font-weight: 900;
  }
}

.el-button {
  margin: 0 28px 24px;
}

@include mobile {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
