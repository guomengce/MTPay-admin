<template>
  <el-dialog
    :model-value="modelValue"
    title="命中規則"
    width="680px"
    append-to-body
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="risk-hits-table">
      <el-table :data="hits" class="admin-data-table" stripe>
        <el-table-column label="規則" min-width="230">
          <template #default="{ row }">
            <strong class="risk-rule-name">{{ row.rule_name }}</strong>
          </template>
        </el-table-column>
        <el-table-column label="風險等級" width="110">
          <template #default="{ row }">
            <StatusBadge v-bind="getRiskLevel(row.risk_level)" />
          </template>
        </el-table-column>
        <el-table-column label="判定值" min-width="210">
          <template #default="{ row }">
            <div class="risk-values">
              <div class="risk-values__row">
                <span class="risk-values__label">實際值</span>
                <strong class="risk-values__value">{{ row.actual_value ?? '—' }}</strong>
              </div>
              <div class="risk-values__row">
                <span class="risk-values__label">閾值</span>
                <strong class="risk-values__value">{{ row.threshold_value ?? '—' }}</strong>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="risk-hits-cards">
      <article v-for="row in hits" :key="row.rule_code" class="risk-hit-card">
        <div class="risk-hit-card__heading">
          <strong class="risk-rule-name">{{ row.rule_name }}</strong>
          <StatusBadge v-bind="getRiskLevel(row.risk_level)" />
        </div>
        <div class="risk-hit-card__values">
          <div class="risk-hit-card__value-row">
            <span class="risk-hit-card__value-label">實際值</span>
            <strong class="risk-hit-card__value">{{ row.actual_value ?? '—' }}</strong>
          </div>
          <div class="risk-hit-card__value-row">
            <span class="risk-hit-card__value-label">閾值</span>
            <strong class="risk-hit-card__value">{{ row.threshold_value ?? '—' }}</strong>
          </div>
        </div>
      </article>
    </div>

    <template #footer>
      <el-button type="primary" @click="emit('update:modelValue', false)">關閉</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { RiskHit } from '@/api/modules/withdrawalRisk';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { getRiskLevel } from '@/views/risk/presentation';

defineProps<{ modelValue: boolean; hits: RiskHit[] }>();
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>();
</script>

<style scoped lang="scss">
.risk-rule-name {
  color: var(--app-text-heading);
}

.risk-values {
  display: grid;
  gap: 6px;

  &__row {
    display: grid;
    align-items: baseline;
    grid-template-columns: 50px auto;
    gap: 10px;
  }

  &__label {
    color: var(--app-text-label);
    font-size: 11px;
  }

  &__value {
    color: var(--app-text-body);
  }
}

.risk-hits-cards {
  display: none;
}

.risk-hit-card {
  display: grid;
  gap: 14px;
  padding: 14px;
  border: 1px solid #dce6f0;
  border-radius: 12px;

  &__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__values {
    display: grid;
    gap: 7px;
  }

  &__value-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  &__value-label {
    color: var(--app-text-label);
    font-size: 12px;
  }

  &__value {
    color: var(--app-text-body);
  }
}

@include mobile {
  .risk-hits-table {
    display: none;
  }

  .risk-hits-cards {
    display: grid;
    gap: 10px;
  }
}
</style>
