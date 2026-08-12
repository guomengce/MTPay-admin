<template>
  <section class="admin-page">
    <AdminHero title="操作记录" description="记录管理员在平台上的所有操作行为" :icon="Clock">
      <template #extra>
        <el-button type="primary" :icon="Filter">筛选</el-button>
      </template>
    </AdminHero>

    <AdminPanel :icon="Tickets">
      <el-timeline class="log-timeline">
        <el-timeline-item
          v-for="item in pagedLogs"
          :key="item.time"
          color="#0ea5a2"
          size="large"
        >
          <article class="log-timeline__item">
            <span class="log-timeline__icon">
              <el-icon><component :is="item.icon" /></el-icon>
            </span>
            <div>
              <h3>
                {{ item.user }} <em>{{ item.type }}</em>
              </h3>
              <p>{{ item.description }}</p>
              <small>192.168.1.25 | Chrome / Windows</small>
            </div>
            <time>{{ item.time }}</time>
          </article>
        </el-timeline-item>
      </el-timeline>
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import {
  Clock,
  Filter,
  Plus,
  Setting,
  SwitchButton,
  Tickets,
} from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

const logs = [
  {
    user: 'MTPay 管理员',
    type: '登入',
    description: '于 2024/08/03 16:08 从 192.168.1.25 登入管理后台',
    time: '16:08:24',
    icon: SwitchButton,
  },
  {
    user: 'MTPay 管理员',
    type: '更新代理帐户',
    description: '于 2024/08/03 15:32 更新代理帐户「代理 A · Apex Trading」的联络方式',
    time: '15:32:17',
    icon: Setting,
  },
  {
    user: 'MTPay 管理员',
    type: '新增代理帐户',
    description: '于 2024/08/03 14:21 新增代理帐户「代理 B · Bluewave Capital」',
    time: '14:21:09',
    icon: Plus,
  },
];

const { page, size, total, pagedData: pagedLogs } = useTablePager(logs);
</script>

<style scoped lang="scss">
.button-showcase {
  display: grid;
  gap: 18px;
  padding: 22px 24px;

  &__section {
    display: grid;
    gap: 12px;
    padding-bottom: 18px;
    border-bottom: 1px solid #eef2f7;

    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }
  }

  h3 {
    margin: 0;
    color: #334155;
    font-size: 14px;
    font-weight: 900;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}

.log-timeline {
  padding: 24px 24px 24px 34px;

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
    grid-template-columns: 52px minmax(0, 1fr) auto;
    gap: 14px;
    padding: 18px 0;
    border-bottom: 1px solid #e6edf5;
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

  h3 {
    margin: 0 0 8px;
    color: #071833;
    font-size: 15px;
    font-weight: 600;

    em {
      margin-left: 10px;
      padding: 3px 10px;
      border-radius: 999px;
      color: #078f82;
      background: #dff6ec;
      font-size: 12px;
      font-style: normal;
    }
  }

  p {
    margin: 0 0 10px;
    color: #42516a;
    font-size: 13px;
    font-weight: 400;
  }

  small,
  time {
    color: #64748b;
    font-weight: 750;
  }
}

@include mobile {
  .button-showcase {
    padding: 16px;

    &__row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    :deep(.el-button) {
      width: 100%;
      min-width: 0;
    }
  }

  .log-timeline {
    padding: 20px;

    &__item {
      grid-template-columns: 44px minmax(0, 1fr);
    }

    &__icon {
      width: 44px;
      height: 44px;
      font-size: 20px;
    }

    time {
      grid-column: 2;
    }
  }
}
</style>
