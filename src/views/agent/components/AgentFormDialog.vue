<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? '编辑代理' : '新增代理'"
    width="560px"
    :close-on-click-modal="false"
    align-center
    @update:model-value="(val) => emit('update:modelValue', val)"
    @open="handleOpen"
  >
    <p class="agent-dialog__hint">
      {{ isEdit ? '修改代理资料将立即生效，已有订单不受影响。' : '建立新代理后，可独立设定兑换比例与出金费率。' }}
    </p>
    <el-form
      ref="formRef"
      class="agent-dialog__form"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent
    >
      <el-form-item label="代理名称" prop="name">
        <el-input v-model="form.name" placeholder="例如：Apex Trading" maxlength="40" show-word-limit />
      </el-form-item>

      <el-form-item label="代理编号" prop="code">
        <el-input v-model="form.code" placeholder="例如：AG-A" maxlength="20" />
      </el-form-item>

      <div class="agent-dialog__row">
        <el-form-item label="联络 Email" prop="email">
          <el-input v-model="form.email" placeholder="finance@example.com" />
        </el-form-item>
        <el-form-item label="联络电话" prop="phone">
          <el-input v-model="form.phone" placeholder="+86 138 0000 0000" />
        </el-form-item>
      </div>

      <div class="agent-dialog__row">
        <el-form-item label="USDT 预设比例" prop="usdt">
          <el-input v-model="form.usdt" placeholder="0.9900">
            <template #append>USDT</template>
          </el-input>
        </el-form-item>
        <el-form-item label="USDC 预设比例" prop="usdc">
          <el-input v-model="form.usdc" placeholder="0.9900">
            <template #append>USDC</template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        {{ isEdit ? '保存修改' : '建立代理' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

export interface AgentFormModel {
  name: string;
  code: string;
  email: string;
  phone: string;
  usdt: string;
  usdc: string;
}

const props = defineProps<{
  modelValue: boolean;
  agent?: Partial<AgentFormModel> | null;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit', form: AgentFormModel): void;
}>();

const formRef = ref<FormInstance>();

const blank: AgentFormModel = {
  name: '',
  code: '',
  email: '',
  phone: '',
  usdt: '0.9900',
  usdc: '0.9900',
};

const form = reactive<AgentFormModel>({ ...blank });
const isEdit = computed(() => !!props.agent?.name);

const ratePattern = /^(0|1)(\.\d{1,4})?$/;

const rules: FormRules<AgentFormModel> = {
  name: [{ required: true, message: '请输入代理名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入代理编号', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9-]+$/, message: '仅允许英文、数字与连字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入 Email', trigger: 'blur' },
    { type: 'email', message: 'Email 格式不正确', trigger: 'blur' },
  ],
  phone: [{ required: true, message: '请输入联络电话', trigger: 'blur' }],
  usdt: [
    { required: true, message: '请输入 USDT 比例', trigger: 'blur' },
    {
      pattern: ratePattern,
      message: '请输入 0~1 之间、最多 4 位小数',
      trigger: 'blur',
    },
  ],
  usdc: [
    { required: true, message: '请输入 USDC 比例', trigger: 'blur' },
    {
      pattern: ratePattern,
      message: '请输入 0~1 之间、最多 4 位小数',
      trigger: 'blur',
    },
  ],
};

watch(
  () => props.agent,
  (val) => {
    Object.assign(form, blank, val || {});
  },
  { immediate: true },
);

function handleOpen() {
  formRef.value?.clearValidate();
}

async function handleSubmit() {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', { ...form });
    }
  });
}
</script>

<style scoped lang="scss">
.agent-dialog {
  &__hint {
    margin: 0 0 18px;
    padding: 10px 14px;
    border-radius: 8px;
    color: #50617b;
    background: #f3f8fc;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.6;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  &__form {
    :deep(.el-form-item) {
      margin-bottom: 18px;
    }

    :deep(.el-form-item__label) {
      color: #071833;
      font-weight: 800;
      padding-bottom: 6px;
    }
  }
}

@include mobile {
  .agent-dialog__row {
    grid-template-columns: 1fr;
  }
}
</style>