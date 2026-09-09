<template>
  <div class="risk-rule-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="分類" min-width="140">
        <template #default="{ row }">
          <span class="rule-category">{{ categoryLabel(row.category) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="規則名稱" min-width="220"
        ><template #default="{ row }"
          ><strong>{{ row.name }}</strong></template
        ></el-table-column
      >
      <el-table-column label="判定條件" min-width="250"
        ><template #default="{ row }"
          ><div class="rule-conditions">
            <span v-for="(value, key) in row.parameters" :key="key" class="rule-conditions__item"
              ><span class="rule-conditions__key">{{ parameterLabel(String(key)) }}</span
              ><strong>{{
                formatRuleParameter(value, String(key), row.parameter_types[key], currency)
              }}</strong></span
            ><span v-if="!Object.keys(row.parameters).length">—</span>
          </div></template
        ></el-table-column
      >
      <el-table-column label="風險等級" min-width="120"
        ><template #default="{ row }"><StatusBadge v-bind="getRiskLevel(row.level)" /></template
      ></el-table-column>
      <el-table-column label="固定處理" min-width="230"
        ><template #default="{ row }">{{ actionLabel(row.action) }}</template></el-table-column
      >
      <el-table-column label="狀態" min-width="100"
        ><template #default="{ row }"
          ><StatusBadge
            :label="row.enabled ? '啟用' : '停用'"
            :type="row.enabled ? 'success' : 'danger'" /></template
      ></el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right"
        ><template #default="{ row }"
          ><el-button type="primary" plain :icon="Setting" @click="emit('edit', row)"
            >配置條件</el-button
          ></template
        ></el-table-column
      >
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue';
import type { RiskRule } from '@/api/modules/withdrawalRisk';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { getRiskLevel } from '../presentation';
import {
  actionLabel,
  categoryLabel,
  formatRuleParameter,
  parameterLabel,
} from '../rulePresentation';
defineProps<{ data: RiskRule[]; currency?: string; loading?: boolean }>();
const emit = defineEmits<{ (event: 'edit', row: RiskRule): void }>();
</script>
<style scoped lang="scss">
.rule-category {
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 7px;
  color: #42617e;
  background: #eef4fa;
  font-size: 12px;
  font-weight: 700;
}
.rule-conditions {
  display: grid;
  gap: 6px;
}
.rule-conditions__item {
  display: flex;
  gap: 8px;
}
.rule-conditions__key {
  color: var(--app-text-label);
  font-size: 12px;
}
@include mobile {
  .risk-rule-table-list {
    display: none;
  }
}
</style>
