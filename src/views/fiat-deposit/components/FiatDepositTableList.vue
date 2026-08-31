<template>
  <div class="table-list">
    <el-table v-loading="loading" :data="items" class="admin-data-table" stripe
      ><el-table-column prop="order_no" label="订单号" min-width="180" /><el-table-column
        label="代理"
        min-width="180"
        ><template #default="{ row }"
          ><strong>{{ row.user.company_name }}</strong
          ><small>{{ row.user.email }}</small></template
        ></el-table-column
      ><el-table-column label="金额" min-width="150"
        ><template #default="{ row }"
          >{{ formatMoney(row.amount) }} {{ row.currency.code }}</template
        ></el-table-column
      ><el-table-column prop="payer_name" label="付款人" min-width="140" /><el-table-column
        prop="remittance_reference"
        label="汇款参考号"
        min-width="180"
      /><el-table-column label="状态" width="110"
        ><template #default="{ row }"
          ><StatusBadge
            :label="row.status_name"
            :type="
              row.status === 1 ? 'success' : row.status === 2 ? 'danger' : 'warning'
            " /></template></el-table-column
      ><el-table-column label="操作" width="100" fixed="right"
        ><template #default="{ row }"
          ><el-button link type="primary" @click="emit('view', row.id)">详情</el-button></template
        ></el-table-column
      ></el-table
    >
  </div>
</template>
<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { formatMoney } from '@/utils/formatMoney';
import type { FiatOrder } from '@/api/modules/fiatDeposit';
defineProps<{ items: FiatOrder[]; loading: boolean }>();
const emit = defineEmits<{ (e: 'view', id: number): void }>();
</script>
<style scoped lang="scss">
.table-list small {
  display: block;
  margin-top: 4px;
  color: #75869a;
}
</style>
