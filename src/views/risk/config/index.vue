<template>
  <section class="admin-page risk-config">
    <AdminHero title="風控管理" :icon="Setting">
      <template #extra><RiskTabs active="config" /></template>
    </AdminHero>

    <AdminPanel>
      <RiskRuleTableList
        :data="rules"
        :currency="currency?.code"
        :loading="loading"
        @edit="openConfig"
      />
      <RiskRuleCardList :data="rules" :currency="currency?.code" @edit="openConfig" />
      <el-empty v-if="!loading && !rules.length" description="暫無風控規則" />
    </AdminPanel>

    <RiskRuleDialog
      v-model="visible"
      v-model:rule="editing"
      :currency="currency?.code || 'USD'"
      :saving="saving"
      @save="save"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Setting } from '@element-plus/icons-vue';

import { getCurrencyList } from '@/api/modules/currency';
import {
  editWithdrawalRiskRule,
  getWithdrawalRiskRuleList,
  type RiskRule,
} from '@/api/modules/withdrawalRisk';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';

import RiskRuleCardList from '../components/RiskRuleCardList.vue';
import RiskRuleDialog from '../components/RiskRuleDialog.vue';
import RiskRuleTableList from '../components/RiskRuleTableList.vue';
import RiskTabs from '../components/RiskTabs.vue';
import { parameterLabel } from '../rulePresentation';

const loading = ref(false);
const saving = ref(false);
const visible = ref(false);
const currency = ref<{ id: number; code: string; name: string } | null>(null);
const rules = ref<RiskRule[]>([]);
const editing = ref<RiskRule | null>(null);

function openConfig(rule: RiskRule) {
  editing.value = {
    ...rule,
    enabled: rule.enabled === true || Number(rule.enabled) === 1,
    parameters: { ...rule.parameters },
  };
  visible.value = true;
}

async function load() {
  loading.value = true;
  try {
    const currencies = await getCurrencyList({ keyword: 'USD', page: 1, limit: 100 });
    const usd = currencies.data.find((item) => item.code.toUpperCase() === 'USD');
    if (!usd) throw new Error('找不到 USD 幣種');
    const result = await getWithdrawalRiskRuleList(usd.id);
    currency.value = result.currency;
    rules.value = result.rules.map((rule) => ({
      ...rule,
      enabled: rule.enabled === true || Number(rule.enabled) === 1,
    }));
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '載入規則失敗');
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!editing.value || !currency.value) return;
  for (const [key, type] of Object.entries(editing.value.parameter_types)) {
    const value = editing.value.parameters[key];
    const text = String(value).trim();
    const isPositiveAmount =
      /^\d+(\.\d{1,8})?$/.test(text) &&
      text
        .replace('.', '')
        .split('')
        .some((digit) => digit !== '0');
    const isPositiveInteger = /^[1-9]\d*$/.test(text);
    if ((type === 'amount' && !isPositiveAmount) || (type === 'integer' && !isPositiveInteger)) {
      ElMessage.warning(`${parameterLabel(key)}格式不正確`);
      return;
    }
  }

  saving.value = true;
  try {
    await editWithdrawalRiskRule({
      currency_id: currency.value.id,
      rule_code: editing.value.code,
      parameters: editing.value.parameters,
      enabled: editing.value.enabled,
    });
    ElMessage.success('規則配置已更新');
    visible.value = false;
    await load();
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>
