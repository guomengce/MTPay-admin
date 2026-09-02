<template>
  <section class="admin-page">
    <AdminHero title="操作記錄" :icon="Clock" />

    <AdminPanel :icon="Tickets">
      <div v-loading="loading" class="log-list__items">
          <article class="log-record" v-for="item in list" :key="item.id">
            <span class="log-record__icon">
              <el-icon><component :is="moduleIcon(item.module_name)" /></el-icon>
            </span>
            <div class="log-record__body">
              <div class="log-record__heading">
                <h3>{{ item.admin_name || '未知管理員' }}</h3>
                <span>{{ moduleLabel(item.module_name) }}</span>
                <em>{{ actionLabel(item.action_name) }}</em>
              </div>
              <p>{{ item.content || '—' }}</p>
            </div>
            <time>{{ item.operated_at || '—' }}</time>
          </article>
      </div>

      <el-empty v-if="!loading && list.length === 0" description="暫無操作記錄" />

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
/** 操作記錄列表：真實分頁，只讀。 */
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
  admin: '管理員',
  agent: '代理賬户',
  currency: '幣種管理',
  config: '業務配置',
  deposit: '入金',
  exchange: '數字貨幣兌換',
  whitelist: '白名單',
  withdrawal: '法幣出金',
};

function moduleLabel(module: string) {
  return MODULE_LABELS[module] || module || '—';
}

const ACTION_LABELS: Record<string, string> = {
  create: '新增',
  update: '修改',
  delete: '刪除',
  status: '修改狀態',
  review: '審核',
  request_supplement: '要求補件',
  process_payment: '登記付款結果',
  append_payment_files: '追加付款憑證',
  set_default_rates: '設置默認比例',
  set_agent_rates: '設置專屬比例',
  clear_agent_rates: '恢復默認比例',
  set_withdrawal_fee: '設置法幣出金手續費',
  set_receiving_address: '設置收款地址',
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
  &__items {
    display: grid;
    min-height: 180px;
    gap: 12px;
    padding: 22px 24px 8px;
  }

  &__pager {
    display: flex;
    justify-content: flex-end;
    padding-top: 14px;
  }
}

.log-record {
  display: grid;
  min-width: 0;
  align-items: center;
  padding: 16px 18px;
  border: 1px solid #dfe8f1;
  border-radius: 13px;
  background: #fbfdff;
  box-shadow: 0 4px 12px rgb(31 66 102 / 4%);
  grid-template-columns: 46px minmax(0, 1fr) auto;
  gap: 14px;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;

  &:hover {
    border-color: #b9ddd9;
    box-shadow: 0 8px 20px rgb(31 66 102 / 8%);
    transform: translateY(-1px);
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

  &__body { min-width: 0; }

  &__heading { display: flex; min-width: 0; flex-wrap: wrap; align-items: center; gap: 7px; margin-bottom: 7px; }

  h3 {
    margin: 0;
    color: var(--app-text-heading);
    font-size: 15px;
    font-weight: 600;
  }

  &__heading span, &__heading em { display:inline-flex; padding:3px 9px; border-radius:999px; font-size:12px; font-style:normal; font-weight:600; }
  &__heading span { color:#40617e; background:#edf3f8; }
  &__heading em { color:#078f82; background:#dff6ec; }

  p {
    margin: 0;
    color: #42516a;
    font-size: 13px;
    line-height: 1.55;
  }

  time { align-self:start; padding-top:3px; color:var(--app-text-label); font-size:12px; font-weight:500; white-space:nowrap; }
}

@include mobile {
  .log-list__items { padding:16px 14px 6px; }
  .log-record {
    align-items:start;
    padding:14px;
    grid-template-columns:40px minmax(0, 1fr);
    &__icon {
      width: 40px;
      height: 40px;
      font-size: 18px;
    }
    time {
      grid-column: 2;
    }
    time { grid-column:2; padding-top:0; }
  }
}
</style>
