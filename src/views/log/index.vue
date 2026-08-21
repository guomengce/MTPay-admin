<template>
  <section class="admin-page">
    <AdminHero title="操作记录" description="记录管理员在平台上的重要操作，仅只读" :icon="Clock" />

    <AdminPanel :icon="Tickets">
      <el-timeline v-loading="loading" class="log-timeline">
        <el-timeline-item v-for="item in list" :key="item.id" color="#0ea5a2" size="large">
          <article class="log-timeline__item">
            <span class="log-timeline__icon">
              <el-icon><component :is="moduleIcon(item.module)" /></el-icon>
            </span>
            <div class="log-timeline__body">
              <h3>
                {{ item.admin_name || '未知管理员' }}
                <em>{{ moduleLabel(item.module) }} · {{ actionLabel(item.action) }}</em>
              </h3>
              <p>{{ item.content || '—' }}</p>
            </div>
            <time>{{ item.operated_at || '—' }}</time>
          </article>
        </el-timeline-item>
      </el-timeline>

      <el-empty v-if="!loading && list.length === 0" description="暂无操作记录" />

      <div class="log-list__pager">
        <TablePager
          :model-value="page"
          :page-size="limit"
          :total="total"
          @update:model-value="setPage"
          @update:page-size="setLimit"
        />
      </div>
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
/** 操作记录列表：真实分页，只读。 */
import { onMounted, ref, type Component } from 'vue';
import {
  Clock,
  Coin,
  CreditCard,
  DocumentChecked,
  Postcard,
  Setting,
  Switch,
  Tickets,
  User,
  Wallet,
} from '@element-plus/icons-vue';

import * as LogApi from '@/api/modules/log';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';

const loading = ref(false);
const list = ref<LogApi.AdminOperationLog[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(15);

const MODULE_LABELS: Record<string, string> = {
  admin: '管理员',
  agent: '代理账户',
  currency: '币种管理',
  config: '业务配置',
  deposit: '入金',
  exchange: '兑换',
  whitelist: '白名单',
  withdrawal: 'USD出金',
};

function moduleLabel(module: string) {
  return MODULE_LABELS[module] || module || '—';
}

const ACTION_LABELS: Record<string, string> = {
  create: '新增',
  update: '修改',
  delete: '删除',
  status: '修改状态',
  review: '审核',
  request_supplement: '要求补件',
  process_payment: '登记付款结果',
  append_payment_files: '追加付款凭证',
  set_default_rates: '设置默认比例',
  set_agent_rates: '设置专属比例',
  clear_agent_rates: '恢复默认比例',
  set_withdrawal_fee: '设置出金手续费',
  set_receiving_address: '设置收款地址',
};

function actionLabel(action: string) {
  return ACTION_LABELS[action] || action || '操作';
}

const MODULE_ICONS: Record<string, Component> = {
  admin: Setting,
  agent: User,
  currency: Coin,
  config: Setting,
  deposit: Wallet,
  exchange: Switch,
  whitelist: Postcard,
  withdrawal: CreditCard,
};

function moduleIcon(module: string): Component {
  return MODULE_ICONS[module] || DocumentChecked;
}

async function loadList() {
  loading.value = true;
  try {
    const result = await LogApi.fetchOperationLogList({ page: page.value, limit: limit.value });
    list.value = result.data ?? [];
    total.value = result.total ?? 0;
    page.value = result.current_page ?? page.value;
    limit.value = result.per_page ?? limit.value;
  } finally {
    loading.value = false;
  }
}

function setPage(value: number) {
  page.value = value;
  void loadList();
}

function setLimit(value: number) {
  limit.value = value;
  page.value = 1;
  void loadList();
}

onMounted(loadList);
</script>

<style scoped lang="scss">
.log-list {
  &__pager {
    display: flex;
    justify-content: flex-end;
    padding-top: 14px;
  }
}

.log-timeline {
  min-height: 180px;
  padding: 28px 26px 12px 36px;

  :deep(.el-timeline-item) {
    padding-bottom: 0;
  }
  :deep(.el-timeline-item__node--large) {
    left: -3px;
    width: 18px;
    height: 18px;
  }
  :deep(.el-timeline-item__wrapper) {
    top: -16px;
    padding-left: 28px;
  }

  &__item {
    display: grid;
    align-items: start;
    padding: 18px 0;
    border-bottom: 1px solid #e6edf5;
    grid-template-columns: 52px minmax(0, 1fr) auto;
    gap: 14px;
  }

  :deep(.el-timeline-item:last-child) &__item {
    border-bottom: 0;
  }

  &__icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: #0aa99a;
    background: #e5faf6;
    font-size: 20px;
  }

  &__body {
    min-width: 0;
  }

  h3 {
    margin: 0 0 8px;
    color: var(--app-text-heading);
    font-size: 15px;
    font-weight: 600;

    em {
      display: inline-flex;
      margin-left: 10px;
      padding: 3px 10px;
      border-radius: 999px;
      color: #078f82;
      background: #dff6ec;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
    }
  }

  p {
    margin: 0 0 10px;
    color: #42516a;
    font-size: 13px;
    line-height: 1.55;
  }

  time {
    color: var(--app-text-label);
    font-size: 12px;
    font-weight: 500;
  }

  time {
    white-space: nowrap;
  }
}

@include mobile {
  .log-timeline {
    padding: 20px;

    &__item {
      grid-template-columns: 44px minmax(0, 1fr);
    }
    &__icon {
      width: 40px;
      height: 40px;
      font-size: 18px;
    }
    time {
      grid-column: 2;
    }
    h3 em {
      margin: 6px 0 0;
    }
  }
}
</style>
