<template>
  <div class="withdrawal-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="订单号" min-width="190">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.id }}</strong>
            <span>{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="代理" min-width="230" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.agent }}</strong>
            <span>{{ row.agentCode }}</span>
            <em class="withdrawal-table-list__email">{{ row.agentEmail }}</em>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="付款人" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="withdrawal-table-list__party">
            <div class="withdrawal-table-list__party-name">
              <span class="withdrawal-table-list__party-type">{{ row.payerType }}</span>
              <strong :title="row.payer">{{ row.payer }}</strong>
            </div>
            <span class="withdrawal-table-list__party-no">{{ row.payerNo }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="收款人" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="withdrawal-table-list__party is-payee">
            <div class="withdrawal-table-list__party-name">
              <span class="withdrawal-table-list__party-type">{{ row.payeeType }}</span>
              <strong :title="row.payee">{{ row.payee }}</strong>
            </div>
            <span class="withdrawal-table-list__party-no">{{ row.payeeNo }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="出金金额" min-width="190" align="right">
        <template #default="{ row }">
          <div class="row-title is-right">
            <strong class="withdrawal-table-list__amount">{{ row.amount }} {{ row.currency }}</strong>
            <span>收款人实收</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="总扣款" min-width="190" align="right">
        <template #default="{ row }">
          <div class="row-title is-right">
            <strong>{{ row.totalAmount }} {{ row.currency }}</strong>
            <span>含手续费 {{ row.feeAmount }} {{ row.currency }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="文件" min-width="120" align="center">
        <template #default="{ row }">
          <span class="withdrawal-table-list__files">
            申请文件 {{ row.applicationFileCount }} · 付款凭证 {{ row.paymentFileCount }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="状态" min-width="130">
        <template #default="{ row }">
          <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="320" fixed="right" align="center">
        <template #default="{ row }">
          <div class="withdrawal-table-list__actions">
            <template v-if="row.statusCode === 0">
              <el-button type="success" plain size="small" :icon="CircleCheck" @click="emit('approve', row)">通过</el-button>
              <el-button type="danger" plain size="small" :icon="CircleClose" @click="emit('reject', row)">驳回</el-button>
              <el-button type="warning" plain size="small" :icon="DocumentAdd" @click="emit('supplement', row)">要求补件</el-button>
            </template>
            <el-button
              v-else-if="row.statusCode === 1"
              type="danger"
              plain
              size="small"
              :icon="CircleClose"
              @click="emit('reject', row)"
              >驳回</el-button
            >
            <template v-else-if="row.statusCode === 2">
              <el-button type="success" plain size="small" :icon="CreditCard" @click="emit('payment', { row, result: 'complete' })">付款完成</el-button>
              <el-button type="danger" plain size="small" :icon="CircleClose" @click="emit('payment', { row, result: 'fail' })">付款失败</el-button>
            </template>
            <el-button
              v-else-if="row.statusCode === 3"
              type="primary"
              plain
              size="small"
              :icon="Upload"
              @click="emit('append', row)"
              >追加凭证</el-button
            >
            <el-button type="info" plain size="small" :icon="View" @click="emit('view', row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck, CircleClose, CreditCard, DocumentAdd, Upload, View } from '@element-plus/icons-vue';

import type { WithdrawalPaymentResult } from '@/api/modules/withdrawal';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { WithdrawalRow } from '../composables/mapper';

defineProps<{ data: WithdrawalRow[]; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'view', row: WithdrawalRow): void;
  (e: 'approve', row: WithdrawalRow): void;
  (e: 'reject', row: WithdrawalRow): void;
  (e: 'supplement', row: WithdrawalRow): void;
  (e: 'payment', payload: { row: WithdrawalRow; result: WithdrawalPaymentResult }): void;
  (e: 'append', row: WithdrawalRow): void;
}>();
</script>

<style scoped lang="scss">
.withdrawal-table-list {
  display: block;

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;

    :deep(.el-button + .el-button) {
      margin-left: 0;
    }
  }

  &__email {
    display: block;
    overflow: hidden;
    color: var(--app-text-subtle);
    font-size: 11px;
    font-style: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__party {
    display: grid;
    min-width: 0;
    gap: 5px;
  }

  &__party-name {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 6px;
  }

  &__party-type {
    flex: none;
    padding: 2px 7px;
    border-radius: 999px;
    color: #5e7186;
    background: #edf2f6;
    font-size: 11px;
    font-weight: 600;
  }

  &__party-name strong {
    min-width: 0;
    overflow: hidden;
    color: var(--app-text-body);
    font-size: 13px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__party-no {
    overflow: hidden;
    color: var(--app-text-label);
    font-family: ui-monospace, Consolas, monospace;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__party.is-payee &__party-type {
    color: #0a7f7a;
    background: #e4f6f2;
  }

  &__amount {
    color: #087f7b;
    font-variant-numeric: tabular-nums;
  }

  &__files {
    color: var(--app-text-label);
    font-size: 12px;
  }

  .row-title.is-right {
    align-items: flex-end;
  }

  @include mobile {
    display: none;
  }
}
</style>
