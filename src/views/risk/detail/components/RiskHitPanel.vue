<template>
  <AdminPanel class="risk-hit-panel" title="命中規則" :icon="WarningFilled"
    ><div v-if="hits.length" class="risk-hit-list">
      <article
        v-for="row in hits"
        :key="row.rule_code"
        class="risk-hit-list__item"
        :class="`is-level-${row.risk_level}`"
      >
        <div class="risk-hit-list__summary">
          <strong class="risk-hit-list__name">{{ row.rule_name }}</strong
          ><StatusBadge v-bind="getRiskLevel(row.risk_level)" />
        </div>
        <div class="hit-values">
          <div class="hit-values__item">
            <span class="hit-values__label">實際值</span
            ><strong>{{ row.actual_value ?? '—' }}</strong>
          </div>
          <div class="hit-values__item">
            <span class="hit-values__label">閾值</span
            ><strong>{{ row.threshold_value ?? '—' }}</strong>
          </div>
        </div>
      </article>
    </div>
    <el-empty v-else description="未命中風控規則"
  /></AdminPanel>
</template>
<script setup lang="ts">
import { WarningFilled } from '@element-plus/icons-vue';
import type { RiskHit } from '@/api/modules/withdrawalRisk';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { getRiskLevel } from '../../presentation';
defineProps<{ hits: RiskHit[] }>();
</script>
<style scoped lang="scss">
.risk-hit-panel {
  display: flex;
  height: 700px;
  min-height: 0;
  flex-direction: column;
}
.risk-hit-list {
  display: grid;
  min-height: 0;
  align-content: start;
  flex: 1;
  gap: 10px;
  overflow-y: auto;
  padding: 18px;
}
.risk-hit-list__item {
  display: grid;
  min-width: 0;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid #dce6f0;
  border-left: 4px solid #90a4bb;
  border-radius: 12px;
  background: #fff;
  grid-template-columns: minmax(0, 1fr) minmax(155px, 0.75fr);
  gap: 16px;
}
.risk-hit-list__item.is-level-2 {
  border-left-color: #d38a0c;
}
.risk-hit-list__item.is-level-3 {
  border-left-color: #df3f4b;
}
.risk-hit-list__summary {
  display: grid;
  min-width: 0;
  justify-items: start;
  gap: 9px;
}
.risk-hit-list__name {
  color: var(--app-text-heading);
  font-size: 14px;
}
.hit-values {
  display: grid;
  gap: 7px;
}
.hit-values__item {
  display: grid;
  align-items: baseline;
  justify-content: start;
  grid-template-columns: 40px auto;
  gap: 12px;
}
.hit-values__label {
  color: var(--app-text-label);
  font-size: 11px;
}
@include mobile {
  .risk-hit-list__item {
    align-items: start;
    grid-template-columns: minmax(0, 1fr) auto;
  }
}
</style>
