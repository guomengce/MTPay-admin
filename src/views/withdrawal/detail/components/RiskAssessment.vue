<template>
  <section class="risk-assessment" aria-labelledby="withdrawal-risk-title">
    <h2 id="withdrawal-risk-title" class="risk-assessment__title">風控評估</h2>
    <div class="risk-assessment__summary" :class="`is-level-${risk.risk_level}`">
      <div class="risk-assessment__content">
        <StatusBadge v-bind="getRiskLevel(risk.risk_level)" />
        <strong class="risk-assessment__status">{{ getRiskStatus(risk.risk_status) }}</strong>
        <span class="risk-assessment__hits">{{ risk.hits?.length ?? 0 }} 條規則命中</span>
      </div>
      <div class="risk-assessment__actions">
        <el-button
          v-if="risk.risk_level === 2 && risk.hits?.length"
          class="risk-assessment__action"
          type="warning"
          plain
          :icon="View"
          @click="hitsVisible = true"
        >
          查看命中規則
        </el-button>
        <el-button
          v-if="canViewDetail && risk.risk_case_id"
          class="risk-assessment__action"
          :type="risk.risk_level === 3 ? 'danger' : risk.risk_level === 2 ? 'warning' : 'primary'"
          plain
          :icon="View"
          @click="$emit('view', risk.risk_case_id)"
        >
          查看風控詳情
        </el-button>
      </div>
    </div>
    <RiskHitsDialog v-model="hitsVisible" :hits="risk.hits ?? []" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { View } from '@element-plus/icons-vue';
import type { RiskAssessment } from '@/api/modules/withdrawalRisk';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { getRiskLevel, getRiskStatus } from '@/views/risk/presentation';
import RiskHitsDialog from './RiskHitsDialog.vue';

defineProps<{ risk: RiskAssessment; canViewDetail: boolean }>();
defineEmits<{ (event: 'view', id: number): void }>();

const hitsVisible = ref(false);
</script>

<style scoped lang="scss">
.risk-assessment {
  display: grid;
  gap: 10px;

  &__title {
    margin: 0 2px;
    color: var(--app-text-label);
    font-size: 13px;
    font-weight: 700;
  }

  &__summary {
    display: flex;
    min-width: 0;
    min-height: 58px;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 12px 16px;
    border: 1px solid #d9e4ec;
    border-radius: 12px;
    background: #f8fafc;

    &.is-level-2 {
      border-color: #f0d9ad;
      background: #fffaf1;
    }

    &.is-level-3 {
      border-color: #f0c8cc;
      background: #fff7f7;
    }
  }

  &__content {
    display: flex;
    min-width: 0;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__status {
    color: var(--app-text-heading);
    font-size: 14px;
  }

  &__hits {
    color: var(--app-text-label);
    font-size: 13px;
  }

  &__actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
  }

  &__action {
    flex: none;
  }
}

@include mobile {
  .risk-assessment__summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .risk-assessment__actions {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }

  .risk-assessment__action {
    width: 100%;
    margin-left: 0;
  }
}
</style>
