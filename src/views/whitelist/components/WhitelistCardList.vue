<template>
  <div class="whitelist-card-list">
  <ul class="whitelist-cards">
    <li v-for="row in data" :key="row.id" class="whitelist-card">
      <header class="whitelist-card__head">
        <div class="row-title">
          <strong>{{ row.id }}</strong>
          <span>{{ row.time }}</span>
        </div>
        <span class="type-chip">{{ row.type }}</span>
      </header>

      <dl class="whitelist-card__meta">
        <div>
          <dt>代理</dt>
          <dd>{{ row.agent }}</dd>
        </div>
        <div>
          <dt>主体</dt>
          <dd>
            <strong>{{ row.subject }}</strong>
            <small>{{ row.country }}</small>
          </dd>
        </div>
        <div>
          <dt>关键资料</dt>
          <dd>
            <strong>{{ row.bank }}</strong>
            <small>{{ row.account }}</small>
          </dd>
        </div>
      </dl>

      <div class="whitelist-card__status">
        <StatusBadge :label="row.status" :type="row.statusType" />
      </div>

      <footer class="whitelist-card__actions">
        <el-button class="whitelist-card__action" @click="emit('view', row)">详情</el-button>
        <template v-if="row.statusType === 'pending'">
          <el-button type="success" class="whitelist-card__action" @click="emit('approve', row)">通过</el-button>
          <el-button type="danger" plain class="whitelist-card__action" @click="emit('reject', row)">拒绝</el-button>
        </template>
      </footer>
    </li>
  </ul>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { WhitelistRow } from './WhitelistTableList.vue';

defineProps<{ data: WhitelistRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: WhitelistRow): void;
  (e: 'approve', row: WhitelistRow): void;
  (e: 'reject', row: WhitelistRow): void;
}>();
</script>

<style scoped lang="scss">
.whitelist-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}

.whitelist-cards {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.whitelist-card {
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
      gap: 2px;
      margin: 0;
      color: #1f2a37;
      font-size: 13px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;

      strong {
        color: #071833;
        font-size: 14px;
        font-weight: 900;
      }

      small {
        color: #7a8aa1;
        font-size: 12px;
        font-weight: 700;
        word-break: break-all;
      }
    }
  }

  &__status {
    display: flex;
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