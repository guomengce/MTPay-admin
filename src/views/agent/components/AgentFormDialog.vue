<template>
  <el-dialog
    :model-value="modelValue"
    width="660px"
    class="agent-form-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    align-center
    @update:model-value="(value: boolean) => emit('update:modelValue', value)"
    @open="handleOpen"
  >
    <template #header>
      <header class="agent-form__header">
        <div class="agent-form__heading">
          <span><el-icon><UserFilled /></el-icon></span>
          <div>
            <h2>{{ agent ? '修改代理资料' : '新增代理账户' }}</h2>
            <p>{{ agent ? '更新企业联络资料与账户信息' : '创建待激活账户并发送邮件邀请' }}</p>
          </div>
        </div>
        <el-button circle text :icon="Close" aria-label="关闭" @click="emit('update:modelValue', false)" />
      </header>
    </template>

    <div class="agent-form__body">
      <div class="agent-form__notice" :class="{ 'agent-form__notice--warning': agent }">
        <el-icon><InfoFilled /></el-icon>
        <span>
          {{ agent
            ? '资料保存后立即生效；如果修改 Email，该代理已登录的旧 Token 将失效。'
            : '代理编号由系统自动生成。创建成功后，后端会向代理 Email 发送账户激活邀请。' }}
        </span>
      </div>

      <div v-if="agent" class="agent-form__code">
        <div><small>代理编号</small><strong>{{ agent.agent_code }}</strong></div>
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
        <el-form-item class="agent-form__company" label="公司名称" prop="company_name">
          <el-input
            v-model="form.company_name"
            size="large"
            maxlength="255"
            show-word-limit
            placeholder="请输入代理企业完整名称"
            :prefix-icon="OfficeBuilding"
          />
        </el-form-item>

        <div class="agent-form__row">
          <el-form-item label="联络 Email" prop="email">
            <el-input
              v-model="form.email"
              size="large"
              maxlength="191"
              autocomplete="email"
              placeholder="name@example.com"
              :prefix-icon="Message"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="form.phone"
              size="large"
              maxlength="50"
              autocomplete="tel"
              placeholder="请输入国家区号和电话号码"
              :prefix-icon="Phone"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <template #footer>
      <footer class="agent-form__footer">
        <span><el-icon><Lock /></el-icon>账户资料将通过加密连接提交</span>
        <div>
          <el-button size="large" @click="emit('update:modelValue', false)">取消</el-button>
          <el-button
            type="primary"
            size="large"
            :icon="agent ? DocumentChecked : Plus"
            :loading="submitting"
            @click="handleSubmit"
          >
            {{ agent ? '保存修改' : '创建代理' }}
          </el-button>
        </div>
      </footer>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import {
  Close,
  DocumentChecked,
  InfoFilled,
  Lock,
  Message,
  OfficeBuilding,
  Phone,
  Plus,
  UserFilled,
} from '@element-plus/icons-vue';
import type { AgentAccount, AgentFormPayload } from '@/api/modules/agent';

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
  company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入 Email', trigger: 'blur' },
    { type: 'email', message: 'Email 格式不正确', trigger: 'blur' },
  ],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
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

<style lang="scss">
.agent-form-dialog { padding: 0; }
.agent-form-dialog .el-dialog__header,
.agent-form-dialog .el-dialog__body,
.agent-form-dialog .el-dialog__footer { margin: 0; padding: 0; }

.agent-form {
  &__header {
    display: flex;
    min-height: 108px;
    align-items: center;
    justify-content: space-between;
    padding: 23px 28px;
    color: #ffffff;
    background:
      radial-gradient(circle at 84% 0, rgb(47 224 211 / 25%), transparent 40%),
      linear-gradient(135deg, #061d3d, #0b4165);
  }
  &__header > .el-button { color: #d9e9f7; font-size: 20px; }
  &__heading { display: flex; align-items: center; gap: 15px; }
  &__heading > span {
    display: grid; width: 50px; height: 50px; place-items: center; border: 1px solid rgb(255 255 255 / 25%);
    border-radius: 14px; background: linear-gradient(135deg, #2bd8c5, #1498be); font-size: 24px;
    box-shadow: 0 10px 24px rgb(16 214 196 / 20%);
  }
  &__heading h2 { margin: 0; font-size: 22px; }
  &__heading p { margin: 6px 0 0; color: #b7cce0; font-size: 13px; }

  &__body { padding: 26px 28px 8px; background: #f8fafc; }
  &__notice {
    display: flex; align-items: flex-start; gap: 9px; margin-bottom: 20px; padding: 12px 14px;
    border: 1px solid #cde9e6; border-radius: 11px; color: #39706e; background: #edf9f7;
    font-size: 13px; font-weight: 500; line-height: 1.65;
  }
  &__notice .el-icon { flex: none; margin-top: 3px; color: #0ba49a; font-size: 16px; }
  &__notice--warning { border-color: #f2dfba; color: #7b6334; background: #fff9ed; }
  &__notice--warning .el-icon { color: #d39119; }
  &__code {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding: 14px 16px;
    border: 1px solid #dde6ef; border-radius: 12px; background: #ffffff;
  }
  &__code div { display: grid; gap: 4px; }
  &__code small { color: #8795a8; font-size: 12px; font-weight: 600; }
  &__code strong { color: #10233e; font-size: 16px; letter-spacing: .5px; }
  &__code > span { padding: 5px 11px; border-radius: 999px; color: #087e77; background: #e5f7f4; font-size: 12px; font-weight: 600; }
  &__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  &__footer {
    display: flex; min-height: 82px; align-items: center; justify-content: space-between; gap: 16px;
    padding: 16px 28px; border-top: 1px solid #e3e9f0; background: #ffffff;
  }
  &__footer > span { display: flex; align-items: center; gap: 6px; color: #8190a3; font-size: 12px; }
  &__footer > span .el-icon { color: #0aa097; }
  &__footer > div { display: flex; gap: 10px; }
}

@include mobile {
  .agent-form-dialog { width: calc(100% - 24px) !important; }
  .agent-form__header { min-height: 94px; padding: 19px; }
  .agent-form__heading > span { width: 44px; height: 44px; }
  .agent-form__heading h2 { font-size: 19px; }
  .agent-form__heading p { display: none; }
  .agent-form__body { padding: 20px 18px 2px; }
  .agent-form__row { grid-template-columns: 1fr; gap: 0; }
  .agent-form__footer { align-items: stretch; flex-direction: column; padding: 15px 18px; }
  .agent-form__footer > span { justify-content: center; }
  .agent-form__footer > div, .agent-form__footer .el-button { width: 100%; }
}
</style>
