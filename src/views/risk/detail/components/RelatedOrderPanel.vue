<template>
  <AdminPanel title="代理與出金訂單" :icon="User">
    <div class="detail-grid">
      <div v-for="field in fields" :key="field.label" class="detail-grid__item">
        <span class="detail-grid__label">{{ field.label }}</span>
        <strong>{{ field.value }}</strong>
      </div>
      <div class="detail-grid__item">
        <span class="detail-grid__label">出金訂單</span>
        <el-button
          class="detail-grid__link"
          link
          type="primary"
          @click="$emit('view-withdrawal', detail.withdrawal.id)"
          >{{ detail.withdrawal.order_no }}</el-button
        >
      </div>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { User } from '@element-plus/icons-vue';
import type { RiskCaseDetail } from '@/api/modules/withdrawalRisk';
import AdminPanel from '@/components/admin/AdminPanel.vue';

const props = defineProps<{ detail: RiskCaseDetail }>();
defineEmits<{ (event: 'view-withdrawal', id: number): void }>();
const fields = computed(() => [
  { label: '代理', value: props.detail.user.company_name },
  { label: '代理編號', value: props.detail.user.agent_code },
  { label: 'Email', value: props.detail.user.email },
  { label: '金額', value: `${props.detail.withdrawal.amount} ${props.detail.withdrawal.currency}` },
]);
</script>

<style scoped lang="scss">
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  padding: 22px 24px;
}
.detail-grid__item {
  display: grid;
  gap: 6px;
}
.detail-grid__label {
  color: var(--app-text-label);
  font-size: 12px;
}
.detail-grid__link {
  width: fit-content;
  justify-self: start;
  margin: 0;
  padding: 0;
  text-align: left;
}
@include mobile {
  .detail-grid {
    grid-template-columns: 1fr;
    padding: 18px;
  }
}
</style>
