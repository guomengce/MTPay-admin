<template>
  <AdminPanel
    class="fee-setting-panel withdrawal-fee-panel"
    title="固定出金手续费"
    subtitle="设定每笔 USD 出金的固定手续费"
    :icon="Money"
  >
    <el-form class="settings-form" label-position="top">
      <el-form-item class="fee-input-item" label="USD / 笔">
        <div class="fee-input-shell">
          <span class="fee-input-shell__prefix">$</span>
          <el-input v-model="feeAmount" placeholder="如 10.00" />
        </div>
      </el-form-item>
      <p v-if="error" class="fee-form__error">{{ error }}</p>
    </el-form>

    <div class="fee-hint">
      <el-icon><WarningFilled /></el-icon>
      手续费将从代理利润中扣除，请合理设定以确保利润空间。
    </div>

    <el-button
      class="save-button"
      size="large"
      type="primary"
      :icon="DocumentChecked"
      :loading="saving"
      @click="submit"
    >
      储存手续费
    </el-button>
  </AdminPanel>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { DocumentChecked, Money, WarningFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import { formatFixedFee } from '@/utils/decimal';

const props = defineProps<{ feeAmount?: string; saving?: boolean }>();
const emit = defineEmits<{ (e: 'save', payload: { fee_amount: string }): void }>();

const feeAmount = ref(formatFixedFee(props.feeAmount));
const error = ref('');

watch(
  () => props.feeAmount,
  (value) => {
    if (value !== undefined) feeAmount.value = formatFixedFee(value);
  },
);

function submit() {
  const fee = feeAmount.value.trim();
  if (!/^\d{1,20}(\.\d{1,8})?$/.test(fee)) {
    error.value = '请输入合法手续费（整数最多 20 位、小数最多 8 位）';
    return;
  }
  error.value = '';
  emit('save', { fee_amount: fee });
}
</script>

<style scoped lang="scss">
.fee-setting-panel {
  height: 100%;

  :deep(.admin-panel__header) {
    padding: 24px 28px 12px;
    border-bottom: 0;
  }

  :deep(.admin-panel__icon) {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
    border-radius: 12px;
    color: #ffffff;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    box-shadow: 0 12px 24px rgb(29 78 216 / 18%);
    font-size: 22px;
  }

  :deep(.admin-panel__title) {
    gap: 14px;
  }

  :deep(.admin-panel h2) {
    font-size: 18px;
  }

  :deep(.admin-panel p) {
    font-size: 12px;
  }
}

.settings-form {
  padding: 16px 28px 0;

  :deep(.el-form-item__label) {
    color: #263854;
    font-size: 14px;
    font-weight: 600;
  }
}

.fee-input-item {
  margin-bottom: 0;
}

.fee-input-shell {
  position: relative;
  width: 100%;

  &__prefix {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 24px;
    color: #1f73f2;
    font-size: 22px;
    font-weight: 600;
    transform: translateY(-50%);
  }

  :deep(.el-input-number) {
    width: 100%;
  }

  :deep(.el-input__wrapper) {
    height: 58px;
    border: 1px solid #8db9ff;
    border-radius: 10px;
    background: linear-gradient(180deg, #ffffff, #fbfdff);
    box-shadow:
      0 0 0 3px rgb(31 115 242 / 8%),
      0 8px 18px rgb(16 42 80 / 8%);
  }

  :deep(.el-input__inner) {
    padding-left: 46px;
    color: #1f73f2;
    font-size: 28px;
    font-weight: 600;
    text-align: left;
  }
}

.fee-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 28px;
  padding: 12px 14px;
  border: 1px solid #f9d79b;
  border-radius: 8px;
  color: #b36b00;
  background: #fff7e8;
  font-size: 13px;
  font-weight: 600;

  .el-icon {
    flex: 0 0 auto;
    color: #f59e0b;
    font-size: 16px;
  }
}

.fee-form__error {
  margin: 10px 0 0;
  color: #e23a43;
  font-size: 12px;
  font-weight: 500;
}

.save-button {
  display: flex;
  width: fit-content;
  margin: 0 auto 24px;
}

@include mobile {
  .fee-setting-panel {
    :deep(.admin-panel__header) {
      padding: 18px 18px 8px;
    }
  }

  .settings-form {
    padding: 14px 18px 0;
  }

  .fee-hint {
    align-items: flex-start;
    margin: 12px 18px;
  }

  .save-button {
    width: calc(100% - 36px);
    margin: 0 18px 20px;
  }
}
</style>
