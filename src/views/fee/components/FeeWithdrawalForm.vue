<template>
  <AdminPanel
    class="fee-setting-panel withdrawal-fee-panel"
    title="固定出金手续费"
    subtitle="按币种设定每笔出金的固定手续费"
    :icon="Money"
  >
    <div v-if="items.length" class="fee-currency-grid" v-loading="loading">
      <article
        v-for="(item, index) in items"
        :key="item.currency.id"
        class="fee-currency-grid__item"
        :class="{ 'is-editing': isEditing(item.currency.id) }"
      >
        <header class="fee-currency-grid__head">
          <span
            class="fee-currency-grid__coin"
            :class="`fee-currency-grid__coin--${coinVariant(item.currency.code, index)}`"
          >
            {{ item.currency.code.slice(0, 1) }}
          </span>
          <span class="fee-currency-grid__identity">
            <strong>{{ item.currency.code }}</strong>
            <small>{{ item.currency.name }}</small>
          </span>
        </header>

        <div class="fee-currency-grid__field">
          <template v-if="!isEditing(item.currency.id)">
            <div class="fee-currency-grid__display">
              <strong v-if="item.fee">{{ item.fee }}</strong>
              <span v-if="item.fee" class="fee-currency-grid__unit">{{ item.currency.code }}</span>
              <span v-else class="fee-currency-grid__placeholder">未配置手续费</span>
            </div>
          </template>
          <template v-else>
            <div class="fee-currency-grid__editor">
              <el-input
                v-model="item.fee"
                placeholder="如 10.00"
                inputmode="decimal"
                @input="item.fee = limitDecimalInput($event, 8)"
              ><template #append>{{ item.currency.code }}</template></el-input>
            </div>
            <p v-if="item.error" class="fee-currency-grid__error">{{ item.error }}</p>
          </template>
        </div>

        <footer class="fee-currency-grid__foot">
          <el-tooltip v-if="!isEditing(item.currency.id)" content="修改手续费" placement="top">
            <el-button
              circle
              size="small"
              type="primary"
              plain
              :icon="Edit"
              aria-label="修改手续费"
              :loading="saving && pendingCurrencyId === item.currency.id"
              @click="enterEdit(item.currency.id)"
            />
          </el-tooltip>
          <template v-else>
            <el-tooltip content="取消" placement="top">
              <el-button circle size="small" :icon="Close" aria-label="取消修改" @click="cancelEdit(item.currency.id)" />
            </el-tooltip>
            <el-tooltip content="保存" placement="top">
              <el-button circle size="small" type="primary" :icon="Check" aria-label="保存手续费" :loading="saving && pendingCurrencyId === item.currency.id" @click="submitItem(item)" />
            </el-tooltip>
          </template>
        </footer>
      </article>
    </div>
    <p v-else-if="!loading" class="fee-currency-grid__empty">暂无可配置币种</p>
  </AdminPanel>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Check, Close, Edit, Money } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import { formatFixedFee, limitDecimalInput } from '@/utils/decimal';
import type { WithdrawalFee } from '@/api/modules/fee';

interface WithdrawalFeeItem {
  currency: WithdrawalFee['currency'];
  fee: string;
  originalFee: string;
  error: string;
}

const props = defineProps<{
  fees?: WithdrawalFee[];
  loading?: boolean;
  saving?: boolean;
}>();
const emit = defineEmits<{
  (e: 'save', payload: { currency_id: number | string; fee_amount: string }): void;
}>();

const items = reactive<WithdrawalFeeItem[]>([]);
const editingIds = reactive(new Set<number | string>());
const pendingCurrencyId = ref<number | string | null>(null);

function syncItems(list: WithdrawalFee[] | undefined) {
  editingIds.clear();
  items.splice(0, items.length);
  if (!list) return;
  list.forEach((entry) => {
    items.push({
      currency: entry.currency,
      fee: formatFixedFee(entry.fee_amount),
      originalFee: formatFixedFee(entry.fee_amount),
      error: '',
    });
  });
}

watch(
  () => props.fees,
  (value) => syncItems(value),
  { immediate: true, deep: true },
);

const COIN_VARIANTS = ['blue', 'teal', 'violet', 'amber', 'rose'] as const;
function coinVariant(code: string, index: number) {
  if (!code) return COIN_VARIANTS[index % COIN_VARIANTS.length];
  const seed = code.charCodeAt(0) + (code.charCodeAt(1) || 0);
  return COIN_VARIANTS[seed % COIN_VARIANTS.length];
}

function isEditing(id: number | string) {
  return editingIds.has(id);
}

function enterEdit(id: number | string) {
  editingIds.add(id);
}

function cancelEdit(id: number | string) {
  const item = items.find((entry) => entry.currency.id === id);
  if (item) {
    item.fee = item.originalFee;
    item.error = '';
  }
  editingIds.delete(id);
}

function submitItem(item: WithdrawalFeeItem) {
  const fee = item.fee.trim();
  if (!fee) {
    item.error = '请填写手续费';
    return;
  }
  if (!/^\d{1,20}(\.\d{1,8})?$/.test(fee)) {
    item.error = '手续费格式不合法（整数最多 20 位、小数最多 8 位）';
    return;
  }
  item.error = '';
  pendingCurrencyId.value = item.currency.id;
  emit('save', { currency_id: item.currency.id, fee_amount: fee });
}
</script>

<style scoped lang="scss">
.fee-setting-panel {
  height: 100%;

  :deep(.admin-panel__header) {
    padding: 24px 28px 16px;
    border-bottom: 0;
  }

  :deep(.admin-panel__icon) {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
    border-radius: 12px;
    color: #ffffff;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    box-shadow: 0 12px 24px rgb(29 78 216 / 18%);
    font-size: 22px;
  }

  :deep(.admin-panel__title) {
    gap: 14px;
  }

  :deep(.admin-panel h2) {
    font-size: 18px;
  }

  :deep(.admin-panel p) {
    font-size: 12px;
  }
}

/* 轻量纵向费用列表：适合展示不断增加的币种，不使用传统表格。 */
.fee-currency-grid {
  display: grid;
  min-width: 0;
  padding: 4px 28px 24px;
  gap: 10px;

  &__item {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(145px, .68fr) minmax(145px, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid #dce6f0;
    border-radius: 14px;
    background: linear-gradient(100deg, #f8fbff 0%, #fff 52%);
    box-shadow: 0 7px 18px rgb(16 42 80 / 5%);
    transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;

    &:hover {
      border-color: #b8cde2;
      box-shadow: 0 10px 24px rgb(16 42 80 / 8%);
      transform: translateY(-1px);
    }

    &.is-editing {
      border-color: #7db2f8;
      background: linear-gradient(100deg, #eef6ff 0%, #fff 65%);
      box-shadow: 0 0 0 3px rgb(31 115 242 / 8%);
    }
  }

  &__head { display: flex; min-width: 0; align-items: center; gap: 12px; }
  &__coin {
    display: inline-flex;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #fff;
    font-size: 15px;
    font-weight: 800;
    box-shadow: 0 7px 14px rgb(16 42 80 / 12%);
    &--blue { background: linear-gradient(135deg, #60a5fa, #1d4ed8); }
    &--teal { background: linear-gradient(135deg, #2dd4bf, #0d9488); }
    &--violet { background: linear-gradient(135deg, #a78bfa, #6d28d9); }
    &--amber { background: linear-gradient(135deg, #fbbf24, #d97706); }
    &--rose { background: linear-gradient(135deg, #fb7185, #be123c); }
  }
  &__identity { display: flex; min-width: 0; flex-direction: column; gap: 2px; }
  &__identity strong { color: #14233a; font-family: ui-monospace, Consolas, monospace; font-size: 15px; }
  &__identity small { overflow: hidden; color: #7b8da5; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
  &__field { min-width: 0; }
  &__display { display: flex; min-height: 42px; align-items: center; justify-content: center; gap: 7px; padding: 0 14px; border-radius: 10px; background: #f2f7fb; }
  &__display strong { overflow: hidden; color: #079b97; font-family: ui-monospace, Consolas, monospace; font-size: 21px; text-overflow: ellipsis; white-space: nowrap; }
  &__unit { color: #60758f; font-size: 12px; font-weight: 700; }
  &__placeholder { color: #9aa9bb; font-size: 13px; }
  &__editor :deep(.el-input__wrapper) { min-height: 42px; }
  &__editor :deep(.el-input__inner) { color: #079b97; font-family: ui-monospace, Consolas, monospace; font-size: 18px; font-weight: 700; }
  &__error { margin: 5px 2px 0; color: #e23a43; font-size: 12px; }
  &__foot { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
  &__foot :deep(.el-button) { width: 30px; height: 30px; padding: 0; }
  &__empty { margin: 18px 28px 24px; color: var(--app-text-label); font-size: 13px; }
}

@include narrow {
  .fee-currency-grid__item { grid-template-columns: minmax(130px, .62fr) minmax(135px, 1fr) auto; gap: 10px; }
}

@include mobile {
  .fee-setting-panel :deep(.admin-panel__header) { padding: 18px 18px 12px; }
  .fee-currency-grid { padding: 4px 18px 18px; }
  .fee-currency-grid__item { grid-template-columns: 1fr auto; gap: 12px; padding: 13px; }
  .fee-currency-grid__field { grid-column: 1 / -1; grid-row: 2; }
  .fee-currency-grid__foot { grid-column: 2; grid-row: 1; }
}
</style>