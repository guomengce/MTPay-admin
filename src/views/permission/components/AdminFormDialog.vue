<template>
  <AdminDialog
    :model-value="modelValue"
    :title="dialogTitle"
    :icon="passwordOnly ? Lock : UserFilled"
    tone="brand"
    width="min(520px, calc(100vw - 24px))"
    @open="clearValidation"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form ref="formRef" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="top" autocomplete="off" @submit.prevent>
      <template v-if="!passwordOnly">
        <el-form-item label="管理員名稱" prop="name"><el-input v-model="form.name" autocomplete="off" placeholder="請輸入管理員名稱" /></el-form-item>
        <el-form-item label="Email" prop="email"><el-input v-model="form.email" autocomplete="off" placeholder="name@example.com" /></el-form-item>
        <el-form-item label="角色" prop="role_id"><el-select v-model="form.role_id" placeholder="請選擇角色" filterable><el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" /></el-select></el-form-item>
      </template>
      <el-form-item :label="passwordOnly ? '新密碼' : admin ? '新密碼（留空則不修改）' : '登入密碼'" prop="password"><el-input v-model="form.password" name="admin-new-password" autocomplete="new-password" type="password" show-password placeholder="8–20 位，包含大小寫字母及數字" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">{{ passwordOnly ? '確認修改' : admin ? '儲存修改' : '新增管理員' }}</el-button>
    </template>
  </AdminDialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, UserFilled } from '@element-plus/icons-vue';
import type { AdminAccount, AdminAccountPayload } from '@/api/modules/adminAccount';
import { fetchRoleList, type RoleItem } from '@/api/modules/role';
import AdminDialog from '@/components/admin/AdminDialog.vue';

const props = defineProps<{ modelValue: boolean; admin: AdminAccount | null; submitting?: boolean; passwordOnly?: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'submit', value: AdminAccountPayload): void }>();
const formRef = ref<FormInstance>();
const form = reactive({ name: '', email: '', password: '', role_id: undefined as number | undefined });
const roles = ref<RoleItem[]>([]);
const dialogTitle = computed(() => props.passwordOnly ? '修改密碼' : props.admin ? '修改管理員' : '新增管理員');
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
const rules: FormRules = {
  name: [{ required: true, message: '請輸入管理員名稱', trigger: 'blur' }],
  email: [{ required: true, message: '請輸入 Email', trigger: 'blur' }, { type: 'email', message: 'Email 格式不正確', trigger: 'blur' }],
  role_id: [{ required: true, message: '請選擇角色', trigger: 'change' }],
  password: [{ validator: (_rule, value: string, callback) => {
    if (!value && props.passwordOnly) return callback(new Error('請輸入新密碼'));
    if (!value && props.admin) return callback();
    if (!passwordPattern.test(value || '')) return callback(new Error('密碼須為 8–20 位，並包含大小寫字母及數字'));
    callback();
  }, trigger: 'blur' }],
};
onMounted(async()=>{roles.value=(await fetchRoleList({limit:100})).data});
function clearValidation() { formRef.value?.clearValidate(); }
watch(() => props.modelValue, async (visible) => { if (!visible) return; Object.assign(form, { name: props.admin?.name || '', email: props.admin?.email || '', password: '', role_id: props.admin?.role?.id }); await nextTick(); clearValidation(); }, { flush: 'post' });
async function handleSubmit() { if (!(await formRef.value?.validate().catch(() => false)) || !form.role_id) return; emit('submit', { name: form.name.trim(), email: form.email.trim(), password: form.password || undefined, role_id: form.role_id }); }
</script>
