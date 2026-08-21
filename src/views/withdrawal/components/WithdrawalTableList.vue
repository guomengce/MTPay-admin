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
            <!-- <span>{{ row.agentCode }}</span> -->
            <em class="withdrawal-table-list__email">{{ row.agentEmail }}</em>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="交易主体" min-width="380" header-align="center">
        <template #default="{ row }">
          <WithdrawalPartyFlow
            :payer-name="row.payer"
            :payer-type="row.payerType"
            :payee-name="row.payee"
            :payee-type="row.payeeType"
          />
        </template>
      </el-table-column>

      <el-table-column label="出金金额" min-width="250">
        <template #default="{ row }">
          <div class="withdrawal-table-list__amount-block">
            <strong class="withdrawal-table-list__amount">{{ row.amount }} {{ row.currency }}</strong>
            <div class="withdrawal-table-list__deduction">
              <span>总扣款 {{ row.totalAmount }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="文件" min-width="120" align="center">
        <template #default="{ row }">
          <span class="withdrawal-table-list__files">
            申请文件 {{ row.applicationFileCount }} <br/> 付款凭证 {{ row.paymentFileCount }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="状态" min-width="90">
        <template #default="{ row }">
          <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <el-dropdown
            trigger="click"
            @command="(command: string | number | object) => handleCommand(command, row)"
          >
            <el-button plain :icon="MoreFilled">操作</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="view" :icon="View">详情</el-dropdown-item>
                <template v-if="row.statusCode === 0">
                  <el-dropdown-item command="approve" :icon="CircleCheck">通过</el-dropdown-item>
                  <el-dropdown-item command="supplement" :icon="DocumentAdd">要求补件</el-dropdown-item>
                </template>
                <el-dropdown-item
                  v-if="row.statusCode === 0 || row.statusCode === 1"
                  command="reject"
                  :icon="CircleClose"
                >驳回</el-dropdown-item>
                <template v-if="row.statusCode === 2">
                  <el-dropdown-item command="payment-complete" :icon="CreditCard">付款完成</el-dropdown-item>
                  <el-dropdown-item command="payment-fail" :icon="CircleClose">付款失败</el-dropdown-item>
                </template>
                <el-dropdown-item v-if="row.statusCode === 3" command="append" :icon="Upload">
                  追加凭证
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck, CircleClose, CreditCard, DocumentAdd, MoreFilled, Upload, View } from '@element-plus/icons-vue';

import type { WithdrawalPaymentResult } from '@/api/modules/withdrawal';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { WithdrawalRow } from '../composables/mapper';
import WithdrawalPartyFlow from './WithdrawalPartyFlow.vue';

defineProps<{ data: WithdrawalRow[]; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'view', row: WithdrawalRow): void;
  (e: 'approve', row: WithdrawalRow): void;
  (e: 'reject', row: WithdrawalRow): void;
  (e: 'supplement', row: WithdrawalRow): void;
  (e: 'payment', payload: { row: WithdrawalRow; result: WithdrawalPaymentResult }): void;
  (e: 'append', row: WithdrawalRow): void;
}>();

function handleCommand(command: string | number | object, row: WithdrawalRow) {
  if (command === 'view') return emit('view', row);
  if (command === 'approve') return emit('approve', row);
  if (command === 'reject') return emit('reject', row);
  if (command === 'supplement') return emit('supplement', row);
  if (command === 'append') return emit('append', row);
  if (command === 'payment-complete' || command === 'payment-fail') {
    emit('payment', { row, result: command === 'payment-complete' ? 'complete' : 'fail' });
  }
}
</script>

<style scoped lang="scss">
.withdrawal-table-list {
  display: block;

  &__email {
    display: block;
    overflow: hidden;
    color: var(--app-text-subtle);
    font-size: 11px;
    font-style: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__amount-block {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 9px;
    padding: 8px 0;
  }

  &__amount {
    color: #087f7b;
    font-size: 16px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__deduction {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--app-text-label);
    font-size: 11px;
    font-variant-numeric: tabular-nums;

    i { width: 1px; height: 11px; background: #d6e0e8; }
  }

  &__files {
    color: var(--app-text-label);
    font-size: 12px;
  }

  @include mobile {
    display: none;
  }
}
</style>
