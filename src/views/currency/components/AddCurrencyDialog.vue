<template>
  <el-dialog :model-value="modelValue" title="新增幣種" width="560px" destroy-on-close @close="close">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="幣種類型" prop="type">
        <el-select v-model="form.type" placeholder="請選擇幣種類型">
          <el-option label="數字貨幣" :value="1" />
          <el-option label="法幣" :value="2" />
        </el-select>
      </el-form-item>
      <div class="add-currency-dialog__grid">
        <el-form-item label="幣種代碼" prop="code"><el-input v-model="form.code" maxlength="20" placeholder="例如 USDT" @input="form.code = String($event).toUpperCase()" /></el-form-item>
        <el-form-item label="幣種名稱" prop="name"><el-input v-model="form.name" maxlength="100" placeholder="請輸入幣種名稱" /></el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">確認新增</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { AddCurrencyPayload, CurrencyType } from '@/api/modules/currency';
defineProps<{ modelValue: boolean; submitting: boolean }>();
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void; (event: 'submit', value: AddCurrencyPayload): void }>();
const formRef = ref<FormInstance>();
const form = reactive<{ type?: CurrencyType; code: string; name: string }>({ type: undefined, code: '', name: '' });
const rules: FormRules = {
  type: [{ required: true, message: '請選擇幣種類型', trigger: 'change' }],
  code: [{ required: true, message: '請輸入幣種代碼', trigger: 'blur' }],
  name: [{ required: true, message: '請輸入幣種名稱', trigger: 'blur' }],
};
function reset() { form.type = undefined; form.code = ''; form.name = ''; formRef.value?.clearValidate(); }
function close() { emit('update:modelValue', false); reset(); }
async function submit() { if (!formRef.value || !(await formRef.value.validate().catch(() => false)) || !form.type) return; emit('submit', { type: form.type, code: form.code.trim(), name: form.name.trim() }); }
</script>

<style scoped lang="scss">
.add-currency-dialog__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@include mobile { .add-currency-dialog__grid { grid-template-columns: 1fr; gap: 0; } }
</style>
