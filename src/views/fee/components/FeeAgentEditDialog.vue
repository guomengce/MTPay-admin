<template>
  <el-dialog
    :model-value="modelValue"
    title="修改代理专属比例"
    width="560px"
    :close-on-click-modal="false"
    align-center
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <template v-if="row">
      <p class="fee-agent-dialog__hint">
        为 <strong>{{ row.agent }}</strong>
        （<span>{{ row.code }}</span>）设定 USDT / USDC 兑换比例与金额区间。
      </p>

      <el-form
        ref="formRef"
        class="fee-agent-dialog__form"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="USDT 比例" prop="usdt">
          <el-input v-model="form.usdt" placeholder="如 0.9900" />
        </el-form-item>

        <el-form-item label="USDC 比例" prop="usdc">
          <el-input v-model="form.usdc" placeholder="如 0.9900" />
        </el-form-item>

        <el-form-item label="最低 USD 可得" prop="min">
          <el-input v-model="form.min" placeholder="如 90.00" />
        </el-form-item>

        <el-form-item label="最高 USD 可得" prop="max">
          <el-input v-model="form.max" placeholder="如 990.00" />
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button plain @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" :icon="DocumentChecked" @click="handleSubmit"
        >储存</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { DocumentChecked } from '@element-plus/icons-vue';

import type { FeeAgentRow } from './FeeAgentCardList.vue';

const props = defineProps<{
  modelValue: boolean;
  row: FeeAgentRow | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit', payload: FeeAgentRow): void;
}>();

interface EditForm {
  usdt: string;
  usdc: string;
  min: string;
  max: string;
}

const form = reactive<EditForm>({ usdt: '', usdc: '', min: '', max: '' });

const formRef = ref<FormInstance>();

const rules: FormRules<EditForm> = {
  usdt: [
    { required: true, message: '请填写 USDT 比例', trigger: 'blur' },
    {
      validator: (_rule, value: string, cb) =>
        /^(0?\.\d+|1(\.0+)?)$/.test(value) ? cb() : cb(new Error('请输入 0~1 之间的小数')),
      trigger: 'blur',
    },
  ],
  usdc: [
    { required: true, message: '请填写 USDC 比例', trigger: 'blur' },
    {
      validator: (_rule, value: string, cb) =>
        /^(0?\.\d+|1(\.0+)?)$/.test(value) ? cb() : cb(new Error('请输入 0~1 之间的小数')),
      trigger: 'blur',
    },
  ],
  min: [
    { required: true, message: '请填写最低可得', trigger: 'blur' },
    {
      validator: (_rule, value: string, cb) =>
        /^\d+(\.\d{1,2})?$/.test(value) ? cb() : cb(new Error('请输入合法金额')),
      trigger: 'blur',
    },
  ],
  max: [
    { required: true, message: '请填写最高可得', trigger: 'blur' },
    {
      validator: (_rule, value: string, cb) =>
        /^\d+(\.\d{1,2})?$/.test(value) ? cb() : cb(new Error('请输入合法金额')),
      trigger: 'blur',
    },
  ],
};

watch(
  () => [props.modelValue, props.row] as const,
  ([visible, next]) => {
    if (!visible || !next) return;
    form.usdt = next.usdt;
    form.usdc = next.usdc;
    form.min = next.min.replace(/\s*USD\s*$/i, '');
    form.max = next.max.replace(/\s*USD\s*$/i, '');
    formRef.value?.clearValidate();
  },
  { immediate: true },
);

async function handleSubmit() {
  if (!props.row || !formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  emit('submit', {
    ...props.row,
    usdt: form.usdt,
    usdc: form.usdc,
    min: `${form.min} USD`,
    max: `${form.max} USD`,
  });
  emit('update:modelValue', false);
}
</script>

<style scoped lang="scss">
.fee-agent-dialog {
  &__hint {
    margin: 0 0 18px;
    color: #66758b;
    font-size: 13px;
    font-weight: 800;

    strong {
      color: #061936;
      font-weight: 950;
    }

    span {
      margin: 0 4px;
      padding: 2px 8px;
      border-radius: 999px;
      color: #126df0;
      background: #e8f1ff;
      font-size: 12px;
      font-weight: 850;
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
      font-weight: 850;
    }
  }

  @include mobile {
    &__form {
      grid-template-columns: 1fr;
    }
  }
}
</style>
