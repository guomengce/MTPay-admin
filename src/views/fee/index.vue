<template>
  <section class="admin-page">
    <AdminHero
      title="比例与费用"
      description="下方配置将直接影响代理专属费率与帐金额，请谨慎设定。"
      :icon="PieChart"
    />

    <div class="fee-grid">
      <AdminPanel title="预设兑换比例" subtitle="设定预设的币种兑换比例" :icon="TrendCharts">
        <el-form class="settings-form" :model="rateForm" label-position="top">
          <div class="form-grid">
            <el-form-item label="USDT → USD" prop="defaultUsdt">
              <el-input-number v-model="rateForm.defaultUsdt" :step="0.01" :precision="2" />
            </el-form-item>
            <el-form-item label="USDC → USD" prop="defaultUsdc">
              <el-input-number v-model="rateForm.defaultUsdc" :step="0.01" :precision="2" />
            </el-form-item>
          </div>
        </el-form>
        <div class="hint">此比例将作为代理交易的预设兑换依据</div>
        <el-button type="primary">储存预设比例</el-button>
      </AdminPanel>

      <AdminPanel title="USD出金固定手续费" subtitle="设定每笔USD出金的固定手续费" :icon="Money">
        <el-form class="settings-form" :model="feeForm" label-position="top">
          <el-form-item class="wide-input" label="USD / 笔" prop="fee">
            <el-input v-model="feeForm.fee" />
          </el-form-item>
        </el-form>
        <div class="hint hint--amber">手续费将从代理利润中扣除，请合理设定以确保利润空间。</div>
        <el-button type="success">储存手续费</el-button>
      </AdminPanel>
    </div>

    <AdminPanel title="代理专属比例" subtitle="不同代理可设定不同的专属交易比例" :icon="UserFilled">
      <el-table class="admin-data-table" :data="rows" stripe>
        <el-table-column label="代理" min-width="260">
          <template #default="{ row }">
            <strong>{{ row.agent }}</strong> <span class="type-chip">{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="usdt" label="USDT 比例" min-width="130" />
        <el-table-column prop="usdc" label="USDC 比例" min-width="130" />
        <el-table-column prop="min" label="最低 USD 可得" min-width="160" />
        <el-table-column prop="max" label="最高 USD 可得" min-width="160" />
        <el-table-column label="操作" width="110" fixed="right">
          <template #default>
            <el-button plain>修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="purple-note">代理专属比例优先级高于预设比例，将应用于该代理的所有交易。</div>
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Money, PieChart, TrendCharts, UserFilled } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';

const rateForm = reactive({
  defaultUsdt: 0.99,
  defaultUsdc: 0.99,
});
const feeForm = reactive({
  fee: '50',
});

const rows = [
  {
    agent: '代理A · Apex Trading',
    code: 'AG-A',
    usdt: '0.9900',
    usdc: '0.9900',
    min: '90.00 USD',
    max: '990.00 USD',
  },
  {
    agent: '代理B · Bluewave Capital',
    code: 'AG-B',
    usdt: '0.9000',
    usdc: '0.9000',
    min: '50.00 USD',
    max: '500.00 USD',
  },
];
</script>

<style scoped lang="scss">
.fee-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 24px 28px 12px;
}

.wide-input,
.hint,
.purple-note {
  margin: 18px 28px;
}

.settings-form {
  :deep(.el-form-item__label) {
    color: #263854;
    font-weight: 900;
  }
}

.hint,
.purple-note {
  padding: 13px 16px;
  border-radius: 8px;
  color: #126df0;
  background: #eaf2ff;
  font-weight: 800;

  &--amber {
    color: #9b6510;
    background: #fff1d6;
  }
}

.purple-note {
  border: 1px solid #d8c7ff;
  color: #6b45d8;
  background: #fbf8ff;
}

.el-button {
  margin: 0 28px 24px;
}

@include mobile {
  .fee-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
