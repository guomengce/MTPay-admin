<template>
  <AdminDialog
    :model-value="modelValue"
    :title="mode === 'increase' ? '增加代理資產' : '減少代理資產'"
    :description="asset ? `${asset.currency.code} · 人工調整可用餘額` : '人工調整代理可用餘額'"
    :icon="mode === 'increase' ? Plus : Minus"
    :tone="mode === 'increase' ? 'success' : 'danger'"
    width="min(500px, calc(100vw - 24px))"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="mode === 'increase' ? '增加金額' : '減少金額'" prop="amount">
        <el-input :model-value="form.amount" inputmode="decimal" placeholder="0.00" @update:model-value="updateAmount"><template #append>{{ asset?.currency.code }}</template></el-input>
      </el-form-item>
      <div v-if="asset" class="asset-adjustment__preview" :class="`is-${mode}`">
        <div><span>目前可用餘額</span><strong>{{ formatMoney(formattedCurrentBalance) }} {{ asset.currency.code }}</strong></div>
        <div><span>本次{{ mode === 'increase' ? '增加' : '扣減' }}</span><strong>{{ mode === 'increase' ? '+' : '-' }}{{ formattedAdjustment }} {{ asset.currency.code }}</strong></div>
        <div class="asset-adjustment__result"><span>調整後可用餘額</span><strong>{{ formatMoney(formattedResultBalance) }} {{ asset.currency.code }}</strong></div>
      </div>
      <el-form-item label="調整原因（選填）" prop="remark"><el-input v-model="form.remark" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="請輸入本次人工調整原因" /></el-form-item>
    </el-form>
    <template #footer><el-button :disabled="submitting" @click="emit('update:modelValue', false)">取消</el-button><el-button :type="mode === 'increase' ? 'primary' : 'danger'" :loading="submitting" @click="handleSubmit">確認{{ mode === 'increase' ? '增加' : '減少' }}</el-button></template>
  </AdminDialog>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { computed, reactive, ref, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Minus, Plus } from '@element-plus/icons-vue';
import type { AgentAssetBalance } from '@/api/modules/agent';
import AdminDialog from '@/components/admin/AdminDialog.vue';
import { limitDecimalInput } from '@/utils/decimal';
const props = defineProps<{ modelValue: boolean; asset: AgentAssetBalance | null; mode: 'increase' | 'decrease'; submitting: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'submit', payload: { asset: AgentAssetBalance; mode: 'increase' | 'decrease'; amount: string; remark: string }): void }>();
const formRef = ref<FormInstance>();
const form = reactive({ amount: '', remark: '' });
const rules: FormRules = { amount: [{ required: true, message: '請輸入調整金額', trigger: 'blur' }] };
watch(() => props.modelValue, (visible) => { if (visible) { form.amount = ''; form.remark = ''; formRef.value?.clearValidate(); } });

const decimalPlaces = computed(() => Math.max(0, props.asset?.currency.decimal_places ?? 2));
const currentUnits = computed(() => toUnits(props.asset?.available_balance || '0', decimalPlaces.value));
const adjustmentUnits = computed(() => toUnits(form.amount || '0', decimalPlaces.value));
const resultUnits = computed(() => props.mode === 'increase' ? currentUnits.value + adjustmentUnits.value : currentUnits.value - adjustmentUnits.value);
const formattedCurrentBalance = computed(() => formatUnits(currentUnits.value, decimalPlaces.value));
const formattedAdjustment = computed(() => formatUnits(adjustmentUnits.value, decimalPlaces.value));
const formattedResultBalance = computed(() => formatUnits(resultUnits.value < 0n ? 0n : resultUnits.value, decimalPlaces.value));

function updateAmount(value: string) { form.amount = limitDecimalInput(String(value), decimalPlaces.value); }
function toUnits(value: string, scale: number) { const normalized = String(value).trim(); const [integer = '0', fraction = ''] = normalized.split('.'); return BigInt(integer || '0') * (10n ** BigInt(scale)) + BigInt(fraction.padEnd(scale, '0').slice(0, scale) || '0'); }
function formatUnits(units: bigint, scale: number) {
  const negative = units < 0n;
  const absolute = negative ? -units : units;
  const base = 10n ** BigInt(scale);
  const integer = (absolute / base).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rawFraction = scale ? (absolute % base).toString().padStart(scale, '0') : '';
  const fraction = rawFraction.replace(/0+$/, '').padEnd(Math.min(2, scale), '0');
  return `${negative ? '-' : ''}${integer}${fraction ? `.${fraction}` : ''}`;
}
async function handleSubmit() {
  if (!props.asset || !(await formRef.value?.validate().catch(() => false)) || adjustmentUnits.value <= 0n) return;
  if (props.mode === 'decrease' && resultUnits.value < 0n) { ElMessage.warning('扣減金額不可超過目前可用餘額'); return; }
  emit('submit', { asset: props.asset, mode: props.mode, amount: form.amount, remark: form.remark.trim() });
}
</script>

<style scoped lang="scss">
.asset-adjustment__preview { display: grid; margin: 0 0 18px; padding: 10px 14px; border: 1px solid #dce5ef; border-radius: 12px; background: #f6f9fd; }
.asset-adjustment__preview > div { display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 16px; padding: 9px 0; color: var(--app-text-body); }
.asset-adjustment__preview > div + div { border-top: 1px solid #dce5ef; }
.asset-adjustment__preview span { color: var(--app-text-label); }
.asset-adjustment__preview strong { text-align: right; font-variant-numeric: tabular-nums; }
.asset-adjustment__preview.is-increase > div:nth-child(2) strong,
.asset-adjustment__preview.is-increase .asset-adjustment__result strong { color: #078c78; }
.asset-adjustment__preview.is-decrease > div:nth-child(2) strong { color: #dc2626; }
.asset-adjustment__result { font-size: 15px; }
.asset-adjustment__result strong { font-size: 17px; }
</style>
