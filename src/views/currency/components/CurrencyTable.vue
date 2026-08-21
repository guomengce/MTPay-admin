<template>
  <div class="currency-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="币种" min-width="220">
        <template #default="{ row }">
          <div class="currency-cell">
            <span class="currency-cell__avatar">{{ row.currency.code.slice(0, 1) }}</span>
            <div class="row-title">
              <strong>{{ row.currency.name }}</strong>
              <small>{{ row.currency.code }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="网络" min-width="160">
        <template #default="{ row }">
          <div class="network-cell">
            <strong>{{ row.network.name }}</strong>
            <small>{{ row.network.code }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="当前收款地址" min-width="280">
        <template #default="{ row }">
          <el-tooltip
            v-if="row.current_receiving_address"
            :content="row.current_receiving_address.address"
            placement="top"
            :show-after="120"
          >
            <span class="address-cell is-mono">{{ row.current_receiving_address.address }}</span>
          </el-tooltip>
          <span v-else class="address-empty">暂未设置</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <StatusBadge :label="row.status_name" :type="row.status === 1 ? 'success' : 'danger'" />
        </template>
      </el-table-column>
      <el-table-column label="是否有效" width="100">
        <template #default="{ row }">
          <StatusBadge
            :label="row.is_effective ? '有效' : '无效'"
            :type="row.is_effective ? 'primary' : 'gray'"
          />
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="160">
        <template #default="{ row }">
          <span>{{ row.updated_at || '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <div class="currency-actions">
            <el-button plain type="primary" size="small" :icon="View" @click="emit('detail', row)"
              >详情</el-button
            >
            <el-button
              plain
              type="warning"
              size="small"
              :icon="row.current_receiving_address ? Edit : Plus"
              @click="emit('set-address', row)"
            >
              {{ row.current_receiving_address ? '更换地址' : '设置地址' }}
            </el-button>
            <el-button
              plain
              :type="row.status === 1 ? 'danger' : 'primary'"
              size="small"
              :icon="row.status === 1 ? CircleClose : CircleCheck"
              @click="emit('toggle-status', row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck, CircleClose, Edit, Plus, View } from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { CurrencyNetwork } from '@/api/modules/currency';

defineProps<{ data: CurrencyNetwork[]; loading: boolean }>();
const emit = defineEmits<{
  (event: 'detail', row: CurrencyNetwork): void;
  (event: 'set-address', row: CurrencyNetwork): void;
  (event: 'toggle-status', row: CurrencyNetwork): void;
}>();
</script>

<style scoped lang="scss">
.currency-table-list {
  display: block;

  @include mobile {
    display: none;
  }
}

.currency-cell {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;

  &__avatar {
    display: inline-flex;
    width: 42px;
    height: 42px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: #ffffff;
    background: linear-gradient(135deg, #17c4ad, #1f73f2);
    font-size: 18px;
    font-weight: 600;
  }

  .row-title {
    display: grid;
    min-width: 0;
    gap: 2px;

    strong {
      overflow: hidden;
      color: var(--app-text-body);
      font-size: 14px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: var(--app-text-label);
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.04em;
    }
  }
}

.network-cell {
  display: grid;
  gap: 2px;

  strong {
    color: var(--app-text-body);
    font-size: 13px;
    font-weight: 600;
  }

  small {
    color: var(--app-text-label);
    font-size: 12px;
    font-weight: 400;
  }
}

.address-cell {
  display: inline-block;
  max-width: 240px;
  overflow: hidden;
  color: var(--app-text-body);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 12px;
  font-weight: 500;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
}

.address-empty {
  color: #b1bcca;
  font-size: 12px;
  font-style: italic;
}

.currency-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  white-space: nowrap;
}

.currency-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
