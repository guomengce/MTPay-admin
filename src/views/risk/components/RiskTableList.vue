<template>
  <div class="risk-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="案件編號" min-width="180">
        <template #default="{ row }"
          ><div class="row-title">
            <strong>{{ row.case_no }}</strong
            ><span>{{ row.opened_at || '—' }}</span>
          </div></template
        >
      </el-table-column>
      <el-table-column label="代理" min-width="190">
        <template #default="{ row }"
          ><div class="row-title">
            <strong>{{ row.user.company_name }}</strong
            ><span>{{ row.user.email }}</span>
          </div></template
        >
      </el-table-column>
      <el-table-column label="出金訂單" min-width="190">
        <template #default="{ row }"
          ><div class="row-title">
            <strong>{{ row.withdrawal.order_no }}</strong
            ><span>{{ row.withdrawal.amount }} {{ row.withdrawal.currency }}</span>
          </div></template
        >
      </el-table-column>
      <el-table-column label="風險等級" min-width="120"
        ><template #default="{ row }"
          ><StatusBadge v-bind="getRiskLevel(row.risk_level)" /></template
      ></el-table-column>
      <el-table-column label="案件狀態" min-width="140"
        ><template #default="{ row }"><StatusBadge v-bind="getCaseStatus(row.status)" /></template
      ></el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right"
        ><template #default="{ row }"
          ><el-button type="primary" plain :icon="View" @click="emit('view', row)"
            >詳情</el-button
          ></template
        ></el-table-column
      >
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { View } from '@element-plus/icons-vue';
import type { RiskCaseItem } from '@/api/modules/withdrawalRisk';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { getCaseStatus, getRiskLevel } from '../presentation';

defineProps<{ data: RiskCaseItem[]; loading?: boolean }>();
const emit = defineEmits<{ (event: 'view', row: RiskCaseItem): void }>();
</script>

<style scoped lang="scss">
@include mobile {
  .risk-table-list {
    display: none;
  }
}
</style>
