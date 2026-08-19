<template>
  <AdminPanel title="资产余额" subtitle="可用、冻结与总余额均为接口实时返回" :icon="Wallet">
    <div class="agent-asset-overview__grid">
      <article v-for="asset in assets" :key="asset.currency.id" class="asset-card">
        <header>
          <span>{{ asset.currency.code }}</span
          ><small>{{ asset.currency.name }}</small>
        </header>
        <div class="asset-card__total">
          <small>总余额</small><strong>{{ asset.total_balance }}</strong>
        </div>
        <footer>
          <div>
            <small>可用余额</small><strong>{{ asset.available_balance }}</strong>
          </div>
          <div>
            <small>冻结余额</small><strong>{{ asset.frozen_balance }}</strong>
          </div>
        </footer>
      </article>
      <el-empty v-if="assets.length === 0" description="暂无资产余额" />
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Wallet } from '@element-plus/icons-vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { AgentAssetBalance } from '@/api/modules/agent';

defineProps<{
  assets: AgentAssetBalance[];
}>();
</script>

<style scoped lang="scss">
.agent-asset-overview {
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    padding: 20px;
  }
}

.asset-card {
  padding: 18px;
  border: 1px solid #dce7ef;
  border-radius: 15px;
  background: linear-gradient(145deg, #fff, #f7fbfd);
}
.asset-card header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.asset-card header span {
  color: #087f78;
  font-size: 18px;
  font-weight: 700;
}
.asset-card header small {
  color: var(--app-text-label);
  font-size: 12px;
}
.asset-card__total {
  display: grid;
  gap: 5px;
  margin: 20px 0;
}
.asset-card__total strong {
  overflow-wrap: anywhere;
  color: var(--app-text-heading);
  font-size: 24px;
  font-variant-numeric: tabular-nums;
}
.asset-card footer {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid #e4ebf2;
}
.asset-card footer div {
  display: grid;
  min-width: 0;
  gap: 5px;
}
.asset-card footer strong {
  overflow-wrap: anywhere;
  color: var(--app-text-body);
  font-size: 13px;
  font-weight: 600;
}

@include narrow {
  .agent-asset-overview__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include mobile {
  .agent-asset-overview__grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>
