<template>
  <div class="withdrawal-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="訂單號" min-width="190">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.id }}</strong>
            <span>{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="代理" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.agent }}</strong>
            <em class="withdrawal-table-list__email">{{ row.agentEmail }}</em>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="交易主體" min-width="350" header-align="center">
        <template #default="{ row }">
          <WithdrawalPartyFlow
            :payer-name="row.payer"
            :payer-type="row.payerType"
            :payee-name="row.payee"
            :payee-type="row.payeeType"
          />
        </template>
      </el-table-column>

      <el-table-column label="法幣出金金額" min-width="180">
        <template #default="{ row }">
          <div class="withdrawal-table-list__amount-block">
            <strong class="withdrawal-table-list__amount"
              >{{ formatMoney(row.amount) }} {{ row.currency }}</strong
            >
            <div class="withdrawal-table-list__deduction">
              <span>總扣款 {{ formatMoney(row.totalAmount) }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="狀態" min-width="120">
        <template #default="{ row }">
          <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
        </template>
      </el-table-column>
      <el-table-column label="風控狀態" min-width="150"
        ><template #default="{ row }"
          ><div class="withdrawal-table-list__risk">
            <StatusBadge v-bind="getRiskLevel(row.riskLevel)" /><span
              >{{ getRiskStatus(row.riskStatus)
              }}<template v-if="row.riskHitCount"> · {{ row.riskHitCount }}項命中</template></span
            >
          </div></template
        ></el-table-column
      >

      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <el-dropdown
            trigger="click"
            @command="(command: string | number | object) => handleCommand(command, row)"
          >
            <el-button plain :icon="MoreFilled">操作</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="view" :icon="View">詳情</el-dropdown-item>
                <template v-if="row.statusCode === 0 && !row.riskBlocked">
                  <el-dropdown-item
                    v-if="canOperate('fiatWithdrawal.review')"
                    command="approve"
                    :icon="CircleCheck"
                    >通過</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="canOperate('fiatWithdrawal.supplement')"
                    command="supplement"
                    :icon="DocumentAdd"
                    >要求補件</el-dropdown-item
                  >
                </template>
                <el-dropdown-item
                  v-if="
                    (row.statusCode === 0 || row.statusCode === 1) &&
                    !row.riskBlocked &&
                    canOperate('fiatWithdrawal.review')
                  "
                  command="reject"
                  :icon="CircleClose"
                  >駁回</el-dropdown-item
                >
                <template v-if="row.statusCode === 2 && !row.riskBlocked">
                  <el-dropdown-item
                    v-if="canOperate('fiatWithdrawal.payment')"
                    command="payment-complete"
                    :icon="CreditCard"
                    >付款完成</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="canOperate('fiatWithdrawal.payment')"
                    command="payment-fail"
                    :icon="CircleClose"
                    >付款失敗</el-dropdown-item
                  >
                </template>
                <el-dropdown-item
                  v-if="row.statusCode === 3 && canOperate('fiatWithdrawal.appendProof')"
                  command="append"
                  :icon="Upload"
                >
                  追加憑證
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="row.statusCode === 3 && canOperate('fiatWithdrawal.cancel')"
                  command="cancel-completed"
                  :icon="CircleClose"
                  divided
                  >取消法幣出金</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import {
  CircleCheck,
  CircleClose,
  CreditCard,
  DocumentAdd,
  MoreFilled,
  Upload,
  View,
} from '@element-plus/icons-vue';

import type { WithdrawalPaymentResult } from '@/api/modules/withdrawal';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { usePermission } from '@/composables/usePermission';
import type { WithdrawalRow } from '../composables/mapper';
import WithdrawalPartyFlow from './WithdrawalPartyFlow.vue';
import { getRiskLevel, getRiskStatus } from '@/views/risk/presentation';

defineProps<{ data: WithdrawalRow[]; loading?: boolean }>();
const { canOperate } = usePermission();
const emit = defineEmits<{
  (e: 'cancel-completed', row: WithdrawalRow): void;
  (e: 'view', row: WithdrawalRow): void;
  (e: 'approve', row: WithdrawalRow): void;
  (e: 'reject', row: WithdrawalRow): void;
  (e: 'supplement', row: WithdrawalRow): void;
  (e: 'payment', payload: { row: WithdrawalRow; result: WithdrawalPaymentResult }): void;
  (e: 'append', row: WithdrawalRow): void;
}>();

function handleCommand(command: string | number | object, row: WithdrawalRow) {
  if (command === 'cancel-completed' && row.statusCode === 3) return emit('cancel-completed', row);
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

    i {
      width: 1px;
      height: 11px;
      background: #d6e0e8;
    }
  }

  &__risk {
    display: grid;
    justify-items: start;
    gap: 7px;

    > span:last-child {
      color: var(--app-text-label);
      font-size: 12px;
      line-height: 1.45;
    }
  }

  @include mobile {
    display: none;
  }
}
</style>
