<template>
  <div class="withdrawal-card-list">
  <ul class="withdrawal-cards">
    <li v-for="row in data" :key="row.id" class="withdrawal-card">
      <header class="withdrawal-card__head">
        <div class="row-title">
          <strong>{{ row.id }}</strong>
          <span>{{ row.time }}</span>
        </div>
        <StatusBadge :label="row.status" :type="row.statusType" />
      </header>

      <dl class="withdrawal-card__meta">
        <div>
          <dt>代理</dt>
          <dd>{{ row.agent }}</dd>
        </div>
        <div>
          <dt>付款关系</dt>
          <dd>
            <span class="relation-chip">{{ row.relation }}</span>
            <small>{{ row.parties }}</small>
          </dd>
        </div>
      </dl>

      <div class="withdrawal-card__amount">
        <div class="amount-block">
          <small>收款金额</small>
          <strong>{{ row.amount }}</strong>
        </div>
        <div class="amount-block">
          <small>费用 / 总扣款</small>
          <strong>{{ row.fee }}</strong>
        </div>
      </div>

      <footer class="withdrawal-card__actions">
        <el-button class="withdrawal-card__action" @click="emit('view', row)">详情</el-button>
        <el-button
          v-if="row.statusType === 'process'"
          type="primary"
          class="withdrawal-card__action"
          @click="emit('complete', row)"
        >
          付款完成
        </el-button>
      </footer>
    </li>
  </ul>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { WithdrawalRow } from './WithdrawalTableList.vue';

defineProps<{ data: WithdrawalRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: WithdrawalRow): void;
  (e: 'complete', row: WithdrawalRow): void;
}>();
</script>

<style scoped lang="scss">
.withdrawal-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}

.withdrawal-cards {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.withdrawal-card {
  display: grid;
  gap: 14px;
  padding: 16px 16px 12px;
  border: 1px solid #e3ebf4;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgb(16 42 80 / 5%);

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    .row-title strong {
      color: #071833;
      font-size: 16px;
      font-weight: 900;
    }
    .row-title span {
      color: #7a8aa1;
      font-size: 12px;
      font-weight: 700;
    }
  }

  &__meta {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 12px 14px;
    border: 1px solid #eef2f7;
    border-radius: 10px;
    background: #f8fbfd;

    div {
      display: grid;
      grid-template-columns: 80px 1fr;
      align-items: start;
      gap: 10px;
      min-width: 0;
    }

    dt {
      padding-top: 2px;
      color: #6f7e94;
      font-size: 12px;
      font-weight: 800;
    }

    dd {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 0;
      color: #1f2a37;
      font-size: 13px;
      font-weight: 700;

      .relation-chip {
        justify-self: start;
        display: inline-flex;
        height: 22px;
        align-items: center;
        padding: 0 10px;
        border-radius: 999px;
        color: #126df0;
        background: #eaf2ff;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.5px;
      }

      small {
        color: #7a8aa1;
        font-size: 12px;
        font-weight: 700;
      }
    }
  }

  &__amount {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    .amount-block {
      display: grid;
      gap: 4px;
      padding: 12px 14px;
      border: 1px solid #eef2f7;
      border-radius: 10px;
      background: #fbfdff;
      min-width: 0;

      small {
        color: #6f7e94;
        font-size: 12px;
        font-weight: 800;
      }

      strong {
        color: #071833;
        font-size: 15px;
        font-weight: 900;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  &__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  &__action {
    width: 100%;
  }
}
</style>