<template>
  <el-dialog :model-value="modelValue" :title="admin ? '修改管理員' : '新增管理員'" width="min(520px, calc(100vw - 24px))" @update:model-value="emit('update:modelValue', $event)">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
      <el-form-item label="管理員名稱" prop="name"><el-input v-model="form.name" placeholder="請輸入管理員名稱" /></el-form-item>
      <el-form-item label="Email" prop="email"><el-input v-model="form.email" placeholder="name@example.com" /></el-form-item>
      <el-form-item :label="admin ? '新密碼（留空則不修改）' : '登入密碼'" prop="password"><el-input v-model="form.password" type="password" show-password placeholder="8–20 位，包含大小寫字母及數字" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">{{ admin ? '儲存修改' : '新增管理員' }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { AdminAccount, AdminAccountPayload } from '@/api/modules/adminAccount';

const props = defineProps<{ modelValue: boolean; admin: AdminAccount | null; submitting?: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'submit', value: AdminAccountPayload): void }>();
const formRef = ref<FormInstance>();
const form = reactive({ name: '', email: '', password: '' });
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
const rules: FormRules = {
  name: [{ required: true, message: '請輸入管理員名稱', trigger: 'blur' }],
  email: [{ required: true, message: '請輸入 Email', trigger: 'blur' }, { type: 'email', message: 'Email 格式不正確', trigger: 'blur' }],
  password: [{ validator: (_rule, value: string, callback) => {
    if (!value && props.admin) return callback();
    if (!passwordPattern.test(value || '')) return callback(new Error('密碼須為 8–20 位，並包含大小寫字母及數字'));
    callback();
  }, trigger: 'blur' }],
};
watch(() => props.modelValue, (visible) => { if (!visible) return; Object.assign(form, { name: props.admin?.name || '', email: props.admin?.email || '', password: '' }); formRef.value?.clearValidate(); });
async function handleSubmit() { if (!(await formRef.value?.validate().catch(() => false))) return; emit('submit', { name: form.name.trim(), email: form.email.trim(), password: form.password || undefined }); }
</script>
