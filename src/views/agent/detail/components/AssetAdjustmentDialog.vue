<template>
  <el-dialog :model-value="modelValue" :title="mode === 'increase' ? '增加資產' : '減少資產'" width="min(500px, calc(100vw - 24px))" @update:model-value="emit('update:modelValue', $event)">
    <div v-if="asset" class="asset-adjustment__currency">
      <strong>{{ asset.currency.code }}</strong>
      <span>{{ asset.currency.name }}</span>
      <small>目前可用餘額 {{ asset.available_balance }}</small>
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="mode === 'increase' ? '增加金額' : '減少金額'" prop="amount">
        <el-input v-model="form.amount" inputmode="decimal" placeholder="0.00"><template #append>{{ asset?.currency.code }}</template></el-input>
      </el-form-item>
      <el-form-item label="調整原因（選填）" prop="remark"><el-input v-model="form.remark" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="請輸入本次人工調整原因" /></el-form-item>
    </el-form>
    <template #footer><el-button :disabled="submitting" @click="emit('update:modelValue', false)">取消</el-button><el-button :type="mode === 'increase' ? 'primary' : 'danger'" :loading="submitting" @click="handleSubmit">確認{{ mode === 'increase' ? '增加' : '減少' }}</el-button></template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { AgentAssetBalance } from '@/api/modules/agent';
const props = defineProps<{ modelValue: boolean; asset: AgentAssetBalance | null; mode: 'increase' | 'decrease'; submitting: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'submit', payload: { asset: AgentAssetBalance; mode: 'increase' | 'decrease'; amount: string; remark: string }): void }>();
const formRef = ref<FormInstance>();
const form = reactive({ amount: '', remark: '' });
const rules: FormRules = { amount: [{ required: true, message: '請輸入調整金額', trigger: 'blur' }, { pattern: /^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/, message: '請輸入大於 0 的有效金額', trigger: 'blur' }] };
watch(() => props.modelValue, (visible) => { if (visible) { form.amount = ''; form.remark = ''; formRef.value?.clearValidate(); } });
async function handleSubmit() { if (!props.asset || !(await formRef.value?.validate().catch(() => false)) || Number(form.amount) <= 0) return; emit('submit', { asset: props.asset, mode: props.mode, amount: form.amount, remark: form.remark.trim() }); }
</script>

<style scoped lang="scss">
.asset-adjustment__currency { display: grid; gap: 3px; margin-bottom: 18px; padding: 14px; border-radius: 12px; background: #f3f8fc; }
.asset-adjustment__currency strong { color: #087f78; font-size: 20px; }
.asset-adjustment__currency span, .asset-adjustment__currency small { color: var(--app-text-label); }
</style>
