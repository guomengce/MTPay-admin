<template>
  <AdminPanel title="錢包與收款地址" :icon="Wallet">
    <div class="wallet-info">
      <section class="wallet-account">
        <span class="wallet-account__icon"><el-icon><Key /></el-icon></span>
        <div><small>錢包賬戶地址</small><strong>{{ walletAccountAddress || '—' }}</strong></div>
        <el-button v-if="walletAccountAddress" plain :icon="CopyDocument" @click="copy(walletAccountAddress)">複製</el-button>
      </section>

      <div class="address-table">
        <el-table :data="addresses" table-layout="fixed">
          <el-table-column label="幣種" prop="currency_code" width="110" />
          <el-table-column label="網絡" min-width="130"><template #default="{row}"><strong>{{row.network_code}}</strong><small v-if="row.network_name">{{row.network_name}}</small></template></el-table-column>
          <el-table-column label="COINKEY" prop="coin_key" min-width="160" />
          <el-table-column label="代理專屬地址" min-width="320"><template #default="{row}"><span class="address-value">{{row.address}}</span><el-button text :icon="CopyDocument" @click="copy(row.address)" /></template></el-table-column>
          <el-table-column label="狀態" width="120" align="center"><template #default="{row}"><StatusBadge :label="row.status_name" :type="row.status===1?'success':'gray'" /></template></el-table-column>
        </el-table>
        <el-empty v-if="!addresses.length" description="暫無數字貨幣收款地址" />
      </div>

      <div class="address-cards">
        <article v-for="row in addresses" :key="`${row.coin_key}-${row.address}`">
          <header><strong>{{row.currency_code}} · {{row.network_code}}</strong><StatusBadge :label="row.status_name" :type="row.status===1?'success':'gray'" /></header>
          <dl><div><dt>網絡名稱</dt><dd>{{row.network_name||'—'}}</dd></div><div><dt>COINKEY</dt><dd>{{row.coin_key}}</dd></div><div><dt>代理專屬地址</dt><dd>{{row.address}}<el-button text :icon="CopyDocument" @click="copy(row.address)" /></dd></div></dl>
        </article>
        <el-empty v-if="!addresses.length" description="暫無數字貨幣收款地址" />
      </div>
    </div>
  </AdminPanel>
</template>
<script setup lang="ts">
import {CopyDocument,Key,Wallet} from '@element-plus/icons-vue';import{ElMessage}from'element-plus';import AdminPanel from '@/components/admin/AdminPanel.vue';import StatusBadge from '@/components/admin/StatusBadge.vue';import type{AgentCryptoReceivingAddress}from'@/api/modules/agent';
defineProps<{walletAccountAddress:string;addresses:AgentCryptoReceivingAddress[]}>();
async function copy(value:string){try{await navigator.clipboard.writeText(value);ElMessage.success('已複製')}catch{ElMessage.error('複製失敗，請手動複製')}}
</script>
<style scoped lang="scss">
.wallet-info{display:grid;gap:18px;padding:20px}.wallet-account{display:grid;grid-template-columns:44px minmax(0,1fr) auto;align-items:center;gap:13px;padding:16px 18px;border:1px solid #dce7ef;border-radius:14px;background:linear-gradient(135deg,#f7fbff,#f4fbfa)}.wallet-account__icon{display:grid;width:42px;height:42px;place-items:center;border-radius:11px;color:#087f78;background:#ddf5f1;font-size:20px}.wallet-account>div{display:grid;min-width:0;gap:5px}.wallet-account small{color:var(--app-text-label)}.wallet-account strong{overflow-wrap:anywhere;color:var(--app-text-heading);font-size:16px}.address-table :deep(.cell){display:flex;align-items:center;gap:6px}.address-table small{display:block;color:var(--app-text-label)}.address-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.address-cards{display:none}.address-cards article{padding:15px;border:1px solid #dce7ef;border-radius:13px;background:#fff}.address-cards header{display:flex;align-items:center;justify-content:space-between;gap:10px}.address-cards dl{display:grid;gap:10px;margin:14px 0 0}.address-cards dl>div{display:grid;grid-template-columns:90px minmax(0,1fr);gap:10px}.address-cards dt{color:var(--app-text-label);font-size:12px}.address-cards dd{display:flex;min-width:0;align-items:flex-start;margin:0;overflow-wrap:anywhere;color:var(--app-text-body);font-size:13px}.address-cards .el-button{flex:0 0 auto}@include mobile{.wallet-info{padding:14px}.wallet-account{grid-template-columns:40px minmax(0,1fr);padding:14px}.wallet-account>.el-button{grid-column:1/-1;width:100%}.address-table{display:none}.address-cards{display:grid;gap:12px}}
</style>
