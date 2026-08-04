<template>
  <section class="admin-page">
    <AdminHero title="代理帐户" description="直接新增管理代理帐户" :icon="UserFilled">
      <template #extra>
        <el-button type="primary" size="large" :icon="Plus">新增代理</el-button>
      </template>
    </AdminHero>

    <div class="agent-summary">
      <div v-for="item in summary" :key="item.label">
        <span
          ><el-icon><component :is="item.icon" /></el-icon
        ></span>
        <p>{{ item.label }}</p>
        <strong>{{ item.value }}</strong>
        <small>{{ item.note }}</small>
      </div>
    </div>

    <AdminPanel>
      <el-table class="admin-data-table" :data="agents" stripe>
        <el-table-column label="代理" min-width="260">
          <template #default="{ row }">
            <div class="agent-cell">
              <span>{{ row.avatar }}</span>
              <div class="row-title">
                <strong>{{ row.name }}</strong>
                <small>{{ row.code }}</small>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联络方式" min-width="230">
          <template #default="{ row }">
            <div class="contact-lines">
              <span>{{ row.email }}</span>
              <span>{{ row.phone }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="USDT比例" min-width="130">
          <template #default="{ row }">
            <span class="rate-chip rate-chip--teal">{{ row.usdt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="USDC比例" min-width="130">
          <template #default="{ row }">
            <span class="rate-chip rate-chip--blue">{{ row.usdc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="USD可用" min-width="180">
          <template #default="{ row }">
            <strong>{{ row.balance }}</strong>
            <small class="muted">可用余额</small>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="140">
          <template #default>
            <StatusBadge label="正常使用" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default>
            <el-button plain>设定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <footer class="panel-footer">显示第 1 - 2 笔，共 2 笔</footer>
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import {
  CircleCheckFilled,
  PieChart,
  Plus,
  UserFilled,
  WalletFilled,
} from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';

const summary = [
  { label: '代理总数', value: '2', note: '全部代理帐户', icon: UserFilled },
  { label: '正常使用中', value: '2', note: '占比 100%', icon: CircleCheckFilled },
  { label: '总 USD 可用余额', value: '260,270.00 USD', note: '平台代理总余额', icon: WalletFilled },
  { label: '平均 USDT 比例', value: '0.9450', note: '加权平均', icon: PieChart },
];

const agents = [
  {
    avatar: 'A',
    name: '代理A · Apex Trading',
    code: 'AG-A',
    email: 'finance@apex.test',
    phone: '+65 6123 8801',
    usdt: '0.9900',
    usdc: '0.9900',
    balance: '184,350.00 USD',
  },
  {
    avatar: 'B',
    name: '代理B · Bluewave Capital',
    code: 'AG-B',
    email: 'ops@bluewave.test',
    phone: '+852 3123 9910',
    usdt: '0.9900',
    usdc: '0.9000',
    balance: '75,920.00 USD',
  },
];
</script>

<style scoped lang="scss">
.agent-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid #dce5ef;
  border-radius: 8px;
  background: #dce5ef;
  box-shadow: 0 18px 42px rgb(16 42 80 / 7%);

  div {
    display: grid;
    min-width: 0;
    gap: 6px;
    padding: 28px;
    background: #ffffff;
  }

  span {
    display: inline-flex;
    width: 64px;
    height: 64px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #0aa99a;
    background: #e5faf6;
    font-size: 32px;
  }

  p {
    margin: 8px 0 0;
    color: #52637b;
    font-weight: 850;
  }

  strong {
    color: #071833;
    font-size: 25px;
  }

  small,
  .muted {
    color: #64748b;
    font-weight: 700;
  }
}

.agent-cell {
  display: flex;
  align-items: center;
  gap: 16px;

  > span {
    display: inline-flex;
    width: 56px;
    height: 56px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #ffffff;
    background: linear-gradient(135deg, #17c4ad, #1f73f2);
    font-size: 26px;
    font-weight: 950;
  }
}

.contact-lines {
  display: grid;
  gap: 8px;
  color: #52637b;
}

.rate-chip {
  display: inline-flex;
  height: 34px;
  align-items: center;
  padding: 0 16px;
  border-radius: 999px;
  font-weight: 950;

  &--teal {
    color: #049787;
    background: #d8f7f0;
  }

  &--blue {
    color: #126df0;
    background: #deecff;
  }
}

.panel-footer {
  padding: 20px;
  color: #738197;
  text-align: center;
  font-weight: 800;
}

@include narrow {
  .agent-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include mobile {
  .agent-summary {
    grid-template-columns: 1fr;
  }
}
</style>
