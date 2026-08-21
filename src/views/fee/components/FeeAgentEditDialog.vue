<template>
  <el-dialog
    :model-value="modelValue"
    title="修改代理专属比例"
    width="520px"
    :close-on-click-modal="false"
    align-center
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
  >
    <template v-if="row">
      <p class="fee-agent-dialog__hint">
        为 <strong>{{ row.company_name }}</strong
        >（<span>{{ row.agent_code }}</span
        >）设定 USDT / USDC 兑换比例，保存后立即对该代理生效。
      </p>

      <el-form
        ref="formRef"
        class="fee-agent-dialog__form"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="USDT 比例" prop="usdtRate">
          <el-input
            :model-value="form.usdtRate"
            inputmode="decimal"
            placeholder="如 0.99"
            @input="form.usdtRate = limitDecimalInput($event, 2)"
          />
        </el-form-item>

        <el-form-item label="USDC 比例" prop="usdcRate">
          <el-input
            :model-value="form.usdcRate"
            inputmode="decimal"
            placeholder="如 0.99"
            @input="form.usdcRate = limitDecimalInput($event, 2)"
          />
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button plain @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" :icon="DocumentChecked" :loading="saving" @click="handleSubmit">
        储存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { DocumentChecked } from '@element-plus/icons-vue';

import type { FeeAgentRow } from '../composables/useFeeSettings';
import { limitDecimalInput } from '@/utils/decimal';

const props = defineProps<{
  modelValue: boolean;
  row: FeeAgentRow | null;
  saving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit', payload: { user_id: number; usdt_rate: string; usdc_rate: string }): void;
}>();

const form = reactive({ usdtRate: '', usdcRate: '' });
const formRef = ref<FormInstance>();

function isValidRate(value: string) {
  if (!/^\d{1,16}(\.\d{1,2})?$/.test(value)) return false;
  return !/^0+(?:\.0+)?$/.test(value);
}

const rules: FormRules = {
  usdtRate: [
    { required: true, message: '请填写 USDT 比例', trigger: 'blur' },
    {
      validator: (_rule, value: string, cb) =>
        isValidRate(value)
          ? cb()
          : cb(new Error('请输入大于 0 的比例（最多 2 位小数）')),
      trigger: 'blur',
    },
  ],
  usdcRate: [
    { required: true, message: '请填写 USDC 比例', trigger: 'blur' },
    {
      validator: (_rule, value: string, cb) =>
        isValidRate(value)
          ? cb()
          : cb(new Error('请输入大于 0 的比例（最多 2 位小数）')),
      trigger: 'blur',
    },
  ],
};

watch(
  () => [props.modelValue, props.row] as const,
  ([visible, next]) => {
    if (!visible || !next) return;
    form.usdtRate = next.usdt_rate === '—' ? '' : next.usdt_rate;
    form.usdcRate = next.usdc_rate === '—' ? '' : next.usdc_rate;
    formRef.value?.clearValidate();
  },
  { immediate: true },
);

async function handleSubmit() {
  if (!props.row || !formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  emit('submit', {
    user_id: props.row.user_id,
    usdt_rate: form.usdtRate.trim(),
    usdc_rate: form.usdcRate.trim(),
  });
}
</script>

<style scoped lang="scss">
.fee-agent-dialog {
  &__hint {
    margin: 0 0 18px;
    color: var(--app-text-label);
    font-size: 13px;
    font-weight: 600;

    strong {
      color: var(--app-text-heading);
      font-weight: 600;
    }

    span {
      margin: 0 4px;
      padding: 2px 8px;
      border-radius: 999px;
      color: #126df0;
      background: #e8f1ff;
      font-size: 12px;
      font-weight: 600;
    }
  }

  &__form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 18px;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }

    :deep(.el-form-item__label) {
      color: #263854;
      font-size: 13px;
      font-weight: 600;
    }
  }

  @include mobile {
    &__form {
      grid-template-columns: 1fr;
    }
  }
}
</style>
