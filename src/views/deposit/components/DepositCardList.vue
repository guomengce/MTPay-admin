<template>
  <div class="deposit-card-list">
  <ul class="deposit-cards">
    <li v-for="row in data" :key="row.id" class="deposit-card" :class="{ 'is-pending': row.statusType === 'pending' }">
      <header class="deposit-card__head">
        <div class="row-title">
          <strong>{{ row.id }}</strong>
          <span>{{ row.time }}</span>
        </div>
        <StatusBadge :label="row.status" :type="row.statusType" />
      </header>

      <dl class="deposit-card__meta">
        <div>
          <dt>代理</dt>
          <dd>{{ row.agent }}</dd>
        </div>
        <div>
          <dt>资产 / 网络</dt>
          <dd>
            <span class="asset-name">{{ row.asset }}</span>
            <small>{{ row.network }}</small>
          </dd>
        </div>
        <div>
          <dt>交易哈希</dt>
          <dd class="mono">{{ row.hash }}</dd>
        </div>
      </dl>

      <div class="deposit-card__amount">
        <small>申报金额</small>
        <strong>{{ row.amount }} <em>{{ row.asset }}</em></strong>
      </div>

      <footer class="deposit-card__actions">
        <el-button class="deposit-card__action" @click="emit('view', row)">详情</el-button>
        <template v-if="row.statusType === 'pending'">
          <el-button type="success" class="deposit-card__action" @click="emit('approve', row)">通过</el-button>
          <el-button type="danger" plain class="deposit-card__action" @click="emit('reject', row)">拒绝</el-button>
        </template>
      </footer>
    </li>
  </ul>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { DepositRow } from './DepositTableList.vue';

defineProps<{ data: DepositRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: DepositRow): void;
  (e: 'approve', row: DepositRow): void;
  (e: 'reject', row: DepositRow): void;
}>();
</script>

<style scoped lang="scss">
/* 默认隐藏，≤768px 显示 */
.deposit-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}

.deposit-cards {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.deposit-card {
  display: grid;
  gap: 14px;
  padding: 16px 16px 12px;
  border: 1px solid #e3ebf4;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgb(16 42 80 / 5%);

  &.is-pending {
    background: linear-gradient(180deg, rgb(255 248 232 / 80%), #ffffff 40%);
  }

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
      grid-template-columns: 92px 1fr;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    dt {
      color: #6f7e94;
      font-size: 12px;
      font-weight: 800;
    }

    dd {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      margin: 0;
      color: #1f2a37;
      font-size: 13px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .asset-name {
      color: #126df0;
      font-size: 15px;
      font-weight: 950;
    }

    .mono {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
      font-size: 12px;
      word-break: break-all;
    }
  }

  &__amount {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 12px 14px;
    border: 1px solid #eef2f7;
    border-radius: 10px;
    background: #fbfdff;

    small {
      color: #6f7e94;
      font-size: 12px;
      font-weight: 800;
    }

    strong {
      color: #071833;
      font-size: 20px;
      font-weight: 900;

      em {
        font-style: normal;
        color: #126df0;
        font-size: 13px;
        font-weight: 800;
        margin-left: 4px;
      }
    }
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  &__action {
    width: 100%;
  }
}
</style>