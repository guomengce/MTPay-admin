<template>
  <section class="admin-page">
    <AdminHero
      title="操作记录"
      description="记录管理员在平台上的重要操作，仅只读"
      :icon="Clock"
    />

    <AdminPanel>
      <el-table v-loading="loading" class="admin-data-table" :data="list" stripe>
        <el-table-column label="操作时间" min-width="150">
          <template #default="{ row }">{{ row.operated_at || '—' }}</template>
        </el-table-column>
        <el-table-column label="管理员" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="row-title">
              <strong>{{ row.admin_name }}</strong>
              <span>{{ row.admin_email }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作内容" min-width="260">
          <template #default="{ row }">
            <div class="row-title">
              <strong>{{ row.content }}</strong>
              <span>{{ moduleLabel(row.module) }} · {{ row.action || '—' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作对象" min-width="160">
          <template #default="{ row }">
            <div class="row-title">
              <strong>{{ row.target_id || '—' }}</strong>
              <span>{{ row.target_type || '—' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" min-width="140" />
      </el-table>

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
import { onMounted, ref } from 'vue';
import { Clock } from '@element-plus/icons-vue';

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
</style>
