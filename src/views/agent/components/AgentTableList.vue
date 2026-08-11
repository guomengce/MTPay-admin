<template>
  <div class="agent-table-list">
  <el-table class="admin-data-table agent-table" :data="data" stripe>
    <el-table-column label="代理" min-width="260">
      <template #default="{ row }">
        <div class="agent-cell">
          <span>{{ row.avatar }}</span>
          <div class="row-title">
            <strong>{{ row.name }}</strong>
            <small>{{ row.code }}</small>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="联络方式" min-width="230">
      <template #default="{ row }">
        <div class="contact-lines">
          <span>{{ row.email }}</span>
          <span>{{ row.phone }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="USDT比例" min-width="130">
      <template #default="{ row }">
        <span class="rate-chip rate-chip--teal">{{ row.usdt }}</span>
      </template>
    </el-table-column>
    <el-table-column label="USDC比例" min-width="130">
      <template #default="{ row }">
        <span class="rate-chip rate-chip--blue">{{ row.usdc }}</span>
      </template>
    </el-table-column>
    <el-table-column label="USD可用" min-width="180">
      <template #default="{ row }">
        <div class="balance-cell">
          <strong>{{ row.balance }}</strong>
          <small class="muted">可用余额</small>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="状态" min-width="120">
      <template #default>
        <StatusBadge label="正常使用" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180" fixed="right">
      <template #default="{ row }">
        <el-button plain size="small" @click="emit('edit', row)">编辑</el-button>
        <el-button type="primary" plain size="small" @click="emit('settings', row)">设定</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';

export interface AgentRow {
  avatar: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  usdt: string;
  usdc: string;
  balance: string;
}

defineProps<{ data: AgentRow[] }>();
const emit = defineEmits<{
  (e: 'edit', row: AgentRow): void;
  (e: 'settings', row: AgentRow): void;
}>();
</script>

<style scoped lang="scss">
/* PC 显示，≤768px（全局 mobile 断点）隐藏 */
.agent-table-list {
  display: block;

  @include mobile {
    display: none;
  }
}

.agent-cell {
  display: flex;
  align-items: center;
  gap: 16px;

  > span {
    display: inline-flex;
    width: 56px;
    height: 56px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #ffffff;
    background: linear-gradient(135deg, #17c4ad, #1f73f2);
    font-size: 26px;
    font-weight: 950;
  }
}

.contact-lines {
  display: grid;
  gap: 8px;
  color: #52637b;
}

.balance-cell {
  display: grid;
  gap: 4px;

  strong {
    color: #071833;
    font-size: 17px;
    font-weight: 900;
  }

  .muted {
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
  }
}

.rate-chip {
  display: inline-flex;
  height: 32px;
  align-items: center;
  padding: 0 16px;
  border-radius: 999px;
  font-weight: 950;

  &--teal {
    color: #049787;
    background: #d8f7f0;
  }

  &--blue {
    color: #126df0;
    background: #deecff;
  }
}
</style>