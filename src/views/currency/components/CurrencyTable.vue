<template>
  <div class="currency-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="幣種" min-width="240"><template #default="{ row }"><div class="currency-cell"><span>{{ row.code.slice(0,1) }}</span><div><strong>{{ row.name }}</strong><small>{{ row.code }}</small></div></div></template></el-table-column>
      <el-table-column label="類型" min-width="140"><template #default="{ row }">{{ row.type_name || (row.type===1?'數字貨幣':'法幣') }}</template></el-table-column>
      <el-table-column label="固定手續費" min-width="150"><template #default="{ row }"><strong v-if="row.type===2&&row.fee_amount!=null">{{ formatFixedFee(row.fee_amount) }} {{ row.code }}</strong><span v-else>—</span></template></el-table-column>
      <el-table-column label="狀態" width="120"><template #default="{ row }"><StatusBadge :label="row.status_name||(row.status===1?'啓用':'禁用')" :type="row.status===1?'success':'gray'" /></template></el-table-column>
      <el-table-column label="建立時間" min-width="180"><template #default="{ row }">{{ row.created_at||'—' }}</template></el-table-column>
      <el-table-column label="更新時間" min-width="180"><template #default="{ row }">{{ row.updated_at||'—' }}</template></el-table-column>
      <el-table-column v-if="canOperate('currencies.edit')||canOperate('currencies.status')" label="操作" width="110" fixed="right">
        <template #default="{ row }"><el-dropdown trigger="click" @command="handleCommand($event,row)"><el-button plain :icon="MoreFilled">操作</el-button><template #dropdown><el-dropdown-menu><el-dropdown-item v-if="canOperate('currencies.edit')" command="edit" :icon="Edit">修改</el-dropdown-item><el-dropdown-item v-if="canOperate('currencies.status')" command="toggle-status" :icon="row.status===1?CircleClose:CircleCheck" divided>{{ row.status===1?'禁用':'啓用' }}</el-dropdown-item></el-dropdown-menu></template></el-dropdown></template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { CircleCheck,CircleClose,Edit,MoreFilled } from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';import type{CurrencyItem}from'@/api/modules/currency';import{usePermission}from'@/composables/usePermission';import{formatFixedFee}from'@/utils/decimal';
const{canOperate}=usePermission();defineProps<{data:CurrencyItem[];loading:boolean}>();const emit=defineEmits<{(event:'edit',row:CurrencyItem):void;(event:'toggle-status',row:CurrencyItem):void}>();function handleCommand(command:string|number|object,row:CurrencyItem){if(command==='edit')emit('edit',row);if(command==='toggle-status')emit('toggle-status',row)}
</script>
<style scoped lang="scss">.currency-table-list{display:block;@include mobile{display:none}}.currency-cell{display:flex;align-items:center;gap:14px;min-width:0;>span{display:inline-flex;width:42px;height:42px;flex:none;align-items:center;justify-content:center;border-radius:10px;color:#fff;background:linear-gradient(135deg,#17c4ad,#1f73f2);font-size:18px;font-weight:700}>div{display:grid;min-width:0;gap:2px}strong{color:var(--app-text-body);font-size:14px}small{color:var(--app-text-label);font-size:12px;letter-spacing:.04em}}</style>