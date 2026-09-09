<template>
  <AdminDialog
    :model-value="modelValue"
    :title="agent ? '修改代理資料' : '新增代理賬户'"
    :description="agent ? '更新代理公司的聯絡資料' : '建立新的代理企業與管理聯絡方式'"
    :icon="UserFilled"
    tone="brand"
    width="min(660px, calc(100vw - 24px))"
    @update:model-value="(value: boolean) => emit('update:modelValue', value)"
    @open="handleOpen"
  >
    <div v-if="agent" class="agent-form__code">
        <div><small>代理郵箱</small><strong>{{ agent.email }}</strong></div>
        <span>{{ agent.status_name }}</span>
    </div>

      <el-form
        ref="formRef"
        class="agent-form__form"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        @submit.prevent
      >
        <el-form-item class="agent-form__company" label="公司名稱" prop="company_name">
          <el-input
            v-model="form.company_name"
            size="large"
            maxlength="255"
            show-word-limit
            placeholder="請輸入代理企業完整名稱"
            :prefix-icon="OfficeBuilding"
          />
        </el-form-item>

        <div class="agent-form__row">
          <el-form-item label="聯絡 Email" prop="email">
            <el-input
              v-model="form.email"
              size="large"
              maxlength="191"
              autocomplete="email"
              placeholder="name@example.com"
              :prefix-icon="Message"
            />
          </el-form-item>
          <el-form-item label="聯繫電話" prop="phone">
            <el-input
              v-model="form.phone"
              size="large"
              maxlength="50"
              autocomplete="tel"
              placeholder="請輸入國家區號和電話號碼"
              :prefix-icon="Phone"
            />
          </el-form-item>
        </div>
      </el-form>
    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button
        type="primary"
        :icon="agent ? DocumentChecked : Plus"
        :loading="submitting"
        @click="handleSubmit"
      >
        {{ agent ? '保存修改' : '創建代理' }}
      </el-button>
    </template>
  </AdminDialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import {
  DocumentChecked,
  Message,
  OfficeBuilding,
  Phone,
  Plus,
  UserFilled,
} from '@element-plus/icons-vue';
import type { AgentAccount, AgentFormPayload } from '@/api/modules/agent';
import AdminDialog from '@/components/admin/AdminDialog.vue';

const props = defineProps<{
  modelValue: boolean;
  agent: AgentAccount | null;
  submitting: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', form: AgentFormPayload): void;
}>();

const blank: AgentFormPayload = { company_name: '', email: '', phone: '' };
const form = reactive<AgentFormPayload>({ ...blank });
const formRef = ref<FormInstance>();
const rules: FormRules<AgentFormPayload> = {
  company_name: [{ required: true, message: '請輸入公司名稱', trigger: 'blur' }],
  email: [
    { required: true, message: '請輸入 Email', trigger: 'blur' },
    { type: 'email', message: 'Email 格式不正確', trigger: 'blur' },
  ],
  phone: [{ required: true, message: '請輸入聯繫電話', trigger: 'blur' }],
};

watch(
  () => props.agent,
  (agent) => Object.assign(form, blank, agent ? {
    company_name: agent.company_name,
    email: agent.email,
    phone: agent.phone,
  } : {}),
  { immediate: true },
);

function handleOpen() {
  formRef.value?.clearValidate();
}

async function handleSubmit() {
  if (await formRef.value?.validate().catch(() => false)) {
    emit('submit', { ...form });
  }
}
</script>

<style scoped lang="scss">
.agent-form {
  &__code {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding: 14px 16px;
    border: 1px solid #cfe5e2; border-radius: 12px; background: #f5fbfa;
  }
  &__code div { display: grid; gap: 4px; }
  &__code small { color: #8795a8; font-size: 12px; font-weight: 600; }
  &__code strong { color: #10233e; font-size: 16px; letter-spacing: .5px; }
  &__code > span { padding: 5px 11px; border-radius: 999px; color: #087e77; background: #e5f7f4; font-size: 12px; font-weight: 600; }
  &__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
}

@include mobile {
  .agent-form__row { grid-template-columns: 1fr; gap: 0; }
}
</style>
