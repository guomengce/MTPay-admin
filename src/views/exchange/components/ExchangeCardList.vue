<template>
  <div class="exchange-card-list">
  <ul class="exchange-cards">
    <li v-for="row in data" :key="row.id" class="exchange-card">
      <header class="exchange-card__head">
        <div class="row-title">
          <strong>{{ row.id }}</strong>
          <span>{{ row.time }}</span>
        </div>
        <StatusBadge :label="row.status" :type="row.statusType" />
      </header>

      <dl class="exchange-card__meta">
        <div>
          <dt>代理</dt>
          <dd>{{ row.agent }} <small>{{ row.code }}</small></dd>
        </div>
      </dl>

      <div class="exchange-card__quote">
        <div class="quote-block">
          <small>支付</small>
          <strong>{{ row.amount }}</strong>
          <span class="asset-name">{{ row.asset }}</span>
        </div>
        <div class="quote-arrow" aria-hidden="true">→</div>
        <div class="quote-block">
          <small>获得</small>
          <strong>{{ row.usd }}</strong>
          <span class="rate-chip">比例 {{ row.rate }}</span>
        </div>
      </div>

      <footer class="exchange-card__actions">
        <el-button class="exchange-card__action" @click="emit('view', row)">详情</el-button>
        <template v-if="row.statusType === 'pending'">
          <el-button type="success" class="exchange-card__action" @click="emit('approve', row)">通过</el-button>
          <el-button type="danger" plain class="exchange-card__action" @click="emit('reject', row)">拒绝</el-button>
        </template>
      </footer>
    </li>
  </ul>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { ExchangeRow } from './ExchangeTableList.vue';

defineProps<{ data: ExchangeRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: ExchangeRow): void;
  (e: 'approve', row: ExchangeRow): void;
  (e: 'reject', row: ExchangeRow): void;
}>();
</script>

<style scoped lang="scss">
.exchange-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}

.exchange-cards {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.exchange-card {
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
    margin: 0;
    padding: 12px 14px;
    border: 1px solid #eef2f7;
    border-radius: 10px;
    background: #f8fbfd;

    div {
      display: grid;
      grid-template-columns: 80px 1fr;
      align-items: center;
      gap: 10px;
    }

    dt {
      color: #6f7e94;
      font-size: 12px;
      font-weight: 800;
    }

    dd {
      margin: 0;
      color: #1f2a37;
      font-size: 13px;
      font-weight: 700;

      small {
        margin-left: 6px;
        color: #7a8aa1;
        font-size: 12px;
        font-weight: 700;
      }
    }
  }

  &__quote {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: stretch;
    gap: 10px;
  }

  .quote-block {
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
      font-size: 18px;
      font-weight: 900;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .asset-name {
      color: #126df0;
      font-size: 12px;
      font-weight: 800;
    }

    .rate-chip {
      justify-self: start;
      display: inline-flex;
      height: 22px;
      align-items: center;
      padding: 0 10px;
      border-radius: 999px;
      color: #126df0;
      background: #eaf2ff;
      font-size: 11px;
      font-weight: 800;
    }
  }

  .quote-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a4b9;
    font-size: 20px;
    font-weight: 900;
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