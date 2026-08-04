<template>
  <AdminPanel title="USD出金固定手续费" subtitle="设定每笔USD出金的固定手续费" :icon="Money">
    <el-form class="settings-form" :model="feeForm" label-position="top">
      <el-form-item class="wide-input" label="USD / 笔" prop="fee">
        <el-input v-model="feeForm.fee" />
      </el-form-item>
    </el-form>
    <div class="hint hint--amber">手续费将从代理利润中扣除，请合理设定以确保利润空间。</div>
    <el-button type="success">储存手续费</el-button>
  </AdminPanel>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Money } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';

const feeForm = reactive({
  fee: '50',
});
</script>

<style scoped lang="scss">
.wide-input {
  margin: 18px 28px;
}

.hint {
  margin: 0 28px 18px;
  padding: 13px 16px;
  border-radius: 8px;
  color: #9b6510;
  background: #fff1d6;
  font-weight: 800;
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
</style>
