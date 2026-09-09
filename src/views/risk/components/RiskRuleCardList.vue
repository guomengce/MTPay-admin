<template>
  <div class="risk-rule-card-list"><AdminCardList :items="items" @action="handleAction" /></div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import type { RiskRule } from '@/api/modules/withdrawalRisk';
import AdminCardList, { type AdminCardItem } from '@/components/admin/AdminCardList.vue';
import { getRiskLevel } from '../presentation';
import {
  actionLabel,
  categoryLabel,
  formatRuleParameter,
  parameterLabel,
} from '../rulePresentation';
const props = defineProps<{ data: RiskRule[]; currency?: string }>();
const emit = defineEmits<{ (event: 'edit', row: RiskRule): void }>();
const items = computed<AdminCardItem[]>(() =>
  props.data.map((row) => ({
    key: row.code,
    title: row.name,
    subtitle: categoryLabel(row.category),
    status: { label: row.enabled ? '啟用' : '停用', type: row.enabled ? 'success' : 'danger' },
    fields: [
      { label: '風險等級', badge: getRiskLevel(row.level) },
      {
        label: '判定條件',
        value:
          Object.entries(row.parameters)
            .map(
              ([key, value]) =>
                `${parameterLabel(key)} ${formatRuleParameter(value, key, row.parameter_types[key], props.currency)}`,
            )
            .join(' · ') || '—',
      },
      { label: '固定處理', value: actionLabel(row.action) },
    ],
    actions: [{ key: 'edit', label: '配置條件', icon: Setting, type: 'primary', plain: true }],
  })),
);
function handleAction(action: string, key: string) {
  if (action === 'edit') {
    const row = props.data.find((item) => item.code === key);
    if (row) emit('edit', row);
  }
}
</script>
<style scoped lang="scss">
.risk-rule-card-list {
  display: none;
}
@include mobile {
  .risk-rule-card-list {
    display: block;
  }
}
</style>
