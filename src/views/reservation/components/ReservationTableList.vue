<template>
  <div class="reservation-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="公司" min-width="160">
        <template #default="{ row }"><div class="row-title"><strong>{{ row.company }}</strong></div></template>
      </el-table-column>
      <el-table-column label="聯絡方式" min-width="180">
        <template #default="{ row }"><div class="row-title"><strong>{{ row.contactName }}</strong><span>{{ row.email }}</span><span v-if="row.phone !== '—'">{{ row.phone }}</span></div></template>
      </el-table-column>
      <el-table-column prop="businessType" label="業務類型" min-width="150" />
      <el-table-column prop="currencies" label="所需幣種" min-width="190">
      </el-table-column>
      <el-table-column prop="submittedAt" label="提交時間" min-width="280">
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { ReservationRow } from '../composables/mapper';
defineProps<{ data: ReservationRow[]; loading?: boolean }>();
</script>

<style scoped lang="scss">
.currency-list { display: flex; flex-wrap: wrap; gap: 6px; }
.currency-list span { padding: 4px 9px; border-radius: 8px; color: #315471; background: #edf3f8; font-size: 12px; font-weight: 600; }
.reservation-table-list { display: block; @include mobile { display: none; } }
</style>
