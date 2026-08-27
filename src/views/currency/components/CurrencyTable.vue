<template>
  <div class="currency-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="幣種" min-width="240">
        <template #default="{ row }">
          <div class="currency-cell">
            <span>{{ row.code.slice(0, 1) }}</span>
            <div><strong>{{ row.name }}</strong><small>{{ row.code }}</small></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="類型" min-width="140">
        <template #default="{ row }">{{ row.type_name || (row.type === 1 ? '數字貨幣' : '法幣') }}</template>
      </el-table-column>
      <el-table-column label="狀態" width="120">
        <template #default="{ row }"><StatusBadge :label="row.status_name || (row.status === 1 ? '啓用' : '禁用')" :type="row.status === 1 ? 'success' : 'gray'" /></template>
      </el-table-column>
      <el-table-column label="建立時間" min-width="180"><template #default="{ row }">{{ row.created_at || '—' }}</template></el-table-column>
      <el-table-column label="更新時間" min-width="180"><template #default="{ row }">{{ row.updated_at || '—' }}</template></el-table-column>
      <el-table-column label="操作" width="130" fixed="right">
        <template #default="{ row }">
          <el-button plain :type="row.status === 1 ? 'danger' : 'primary'" size="small" :icon="row.status === 1 ? CircleClose : CircleCheck" @click="emit('toggle-status', row)">{{ row.status === 1 ? '禁用' : '啓用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { CurrencyItem } from '@/api/modules/currency';
defineProps<{ data: CurrencyItem[]; loading: boolean }>();
const emit = defineEmits<{ (event: 'toggle-status', row: CurrencyItem): void }>();
</script>

<style scoped lang="scss">
.currency-table-list { display: block; @include mobile { display: none; } }
.currency-cell { display: flex; align-items: center; gap: 14px; min-width: 0;
  > span { display: inline-flex; width: 42px; height: 42px; flex: none; align-items: center; justify-content: center; border-radius: 10px; color: #fff; background: linear-gradient(135deg, #17c4ad, #1f73f2); font-size: 18px; font-weight: 700; }
  > div { display: grid; min-width: 0; gap: 2px; }
  strong { color: var(--app-text-body); font-size: 14px; }
  small { color: var(--app-text-label); font-size: 12px; letter-spacing: .04em; }
}
</style>
