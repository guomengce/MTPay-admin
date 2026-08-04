<template>
  <section class="admin-page">
    <AdminHero title="操作记录" description="记录管理员在平台上的所有操作行为" :icon="Clock">
      <template #extra>
        <el-button plain :icon="Filter">筛选</el-button>
      </template>
    </AdminHero>

    <AdminPanel title="活动记录" subtitle="共 3 笔记录" :icon="Tickets">
      <div class="timeline">
        <article v-for="item in pagedLogs" :key="item.time">
          <span class="timeline__dot"></span>
          <span class="timeline__icon"
            ><el-icon><component :is="item.icon" /></el-icon
          ></span>
          <div>
            <h3>
              {{ item.user }} <em>{{ item.type }}</em>
            </h3>
            <p>{{ item.description }}</p>
            <small>192.168.1.25 | Chrome / Windows</small>
          </div>
          <time>{{ item.time }}</time>
        </article>
      </div>
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import { Clock, Filter, Plus, Setting, SwitchButton, Tickets } from '@element-plus/icons-vue';

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
.timeline {
  position: relative;
  padding: 34px 34px 34px 86px;

  &::before {
    position: absolute;
    top: 58px;
    bottom: 58px;
    left: 50px;
    width: 2px;
    background: #cfe8e4;
    content: '';
  }

  article {
    position: relative;
    display: grid;
    grid-template-columns: 78px minmax(0, 1fr) auto;
    gap: 22px;
    padding: 28px 0;
    border-bottom: 1px solid #e6edf5;
  }

  article:last-child {
    border-bottom: 0;
  }

  &__dot {
    position: absolute;
    top: 58px;
    left: -42px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #20b9a8;
  }

  &__icon {
    display: inline-flex;
    width: 76px;
    height: 76px;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    color: #0aa99a;
    background: #e5faf6;
    font-size: 34px;
  }

  h3 {
    margin: 0 0 12px;
    color: #071833;
    font-size: 22px;

    em {
      margin-left: 12px;
      padding: 5px 12px;
      border-radius: 999px;
      color: #078f82;
      background: #dff6ec;
      font-size: 14px;
      font-style: normal;
    }
  }

  p {
    margin: 0 0 14px;
    color: #42516a;
    font-size: 16px;
    font-weight: 750;
  }

  small,
  time {
    color: #64748b;
    font-weight: 750;
  }
}

@include mobile {
  .timeline {
    padding: 20px;

    &::before,
    &__dot {
      display: none;
    }

    article {
      grid-template-columns: 52px minmax(0, 1fr);
    }

    &__icon {
      width: 52px;
      height: 52px;
      font-size: 26px;
    }

    time {
      grid-column: 2;
    }
  }
}
</style>
