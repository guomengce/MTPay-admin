<template>
  <AdminPanel
    class="fee-setting-panel rate-setting-panel"
    title="预设兑换比例"
    subtitle="设定预设的精准兑换比例"
    :icon="TrendCharts"
  >
    <el-form class="settings-form" label-position="top">
      <div class="rate-grid">
        <el-form-item class="rate-item rate-item--usdt">
          <template #label>
            <span class="rate-item__label">
              <span class="rate-item__coin">T</span>
              USDT → USD
            </span>
          </template>
          <el-input v-model="usdtRate" placeholder="如 1.000000000000" />
          <p>每 1 USDT 可兑换的 USD 金额</p>
        </el-form-item>

        <el-form-item class="rate-item rate-item--usdc">
          <template #label>
            <span class="rate-item__label">
              <span class="rate-item__coin">$</span>
              USDC → USD
            </span>
          </template>
          <el-input v-model="usdcRate" placeholder="如 1.000000000000" />
          <p>每 1 USDC 可兑换的 USD 金额</p>
        </el-form-item>
      </div>
      <p v-if="error" class="rate-form__error">{{ error }}</p>
    </el-form>
    <el-button
      class="save-button"
      size="large"
      type="primary"
      :icon="Checked"
      :loading="saving"
      @click="submit"
      >储存预设比例</el-button
    >
  </AdminPanel>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Checked, TrendCharts } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';

const props = defineProps<{ usdtRate?: string; usdcRate?: string; saving?: boolean }>();
const emit = defineEmits<{ (e: 'save', payload: { usdt_rate: string; usdc_rate: string }): void }>();

const usdtRate = ref(props.usdtRate ?? '');
const usdcRate = ref(props.usdcRate ?? '');
const error = ref('');

watch(
  () => props.usdtRate,
  (value) => {
    if (value !== undefined) usdtRate.value = value;
  },
);
watch(
  () => props.usdcRate,
  (value) => {
    if (value !== undefined) usdcRate.value = value;
  },
);

function isValidRate(value: string) {
  if (!/^\d{1,16}(\.\d{1,12})?$/.test(value)) return false;
  return !/^0+(?:\.0+)?$/.test(value);
}

function submit() {
  const usdt = usdtRate.value.trim();
  const usdc = usdcRate.value.trim();
  if (!isValidRate(usdt) || !isValidRate(usdc)) {
    error.value = '请输入大于 0 的比例（整数最多 16 位、小数最多 12 位）';
    return;
  }
  error.value = '';
  emit('save', { usdt_rate: usdt, usdc_rate: usdc });
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
    background: linear-gradient(135deg, #12b8b0, #0a7f7a);
    box-shadow: 0 12px 24px rgb(10 127 122 / 18%);
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

.rate-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 38px;
  padding: 16px 28px 24px;

  &::before {
    position: absolute;
    top: 18px;
    bottom: 34px;
    left: 50%;
    width: 1px;
    background: #d9e3ef;
    content: '';
  }
}

.settings-form {
  :deep(.el-form-item__label) {
    color: #263854;
    font-weight: 600;
  }
}

.rate-form__error {
  margin: -8px 28px 0;
  color: #e23a43;
  font-size: 12px;
  font-weight: 500;
}

.rate-item {
  margin-bottom: 0;

  &__label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #14233a;
    font-size: 14px;
    font-weight: 600;
  }

  &__coin {
    display: inline-flex;
    width: 26px;
    height: 26px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    color: #ffffff;
    background: linear-gradient(135deg, #20c7b4, #0c9b92);
    font-size: 13px;
    font-weight: 600;
  }

  &--usdc {
    .rate-item__coin {
      background: linear-gradient(135deg, #60a5fa, #1d4ed8);
    }
  }

  p {
    margin: 10px 0 0;
    color: var(--app-text-subtle);
    font-size: 12px;
    font-weight: 500;
    text-align: center;
  }

  :deep(.el-input) {
    width: 100%;
  }

  :deep(.el-input .el-input__wrapper) {
    height: 58px;
    border: 1px solid #ccd8e6;
    border-radius: 10px;
    background: linear-gradient(180deg, #ffffff, #fbfdff);
    box-shadow: 0 8px 18px rgb(16 42 80 / 8%);
  }

  :deep(.el-input .el-input__inner) {
    color: #0a9a94;
    font-size: 28px;
    font-weight: 600;
  }

  &--usdc {
    :deep(.el-input .el-input__inner) {
      color: #1f73f2;
    }
  }
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

  .rate-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 14px 18px 22px;

    &::before {
      display: none;
    }
  }

  .save-button {
    width: calc(100% - 36px);
    margin: 0 18px 20px;
  }
}
</style>
