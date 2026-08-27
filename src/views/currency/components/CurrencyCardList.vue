<template>
  <div v-loading="loading" class="currency-card-list">
    <AdminCardList v-if="data.length" :items="items" @action="handleAction" />
    <el-empty v-else-if="!loading" description="暫無幣種資料" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import AdminCardList, { type AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { CurrencyItem } from '@/api/modules/currency';
const props = defineProps<{ data: CurrencyItem[]; loading: boolean }>();
const emit = defineEmits<{ (event: 'toggle-status', row: CurrencyItem): void }>();
const items = computed<AdminCardItem[]>(() => props.data.map((row) => ({
  key: String(row.id),
  title: row.name,
  subtitle: row.code,
  status: { label: row.status_name || (row.status === 1 ? '啓用' : '禁用'), type: row.status === 1 ? 'success' : 'gray' },
  fields: [
    { label: '類型', value: row.type_name || (row.type === 1 ? '數字貨幣' : '法幣') },
    { label: '建立時間', value: row.created_at || '—' },
    { label: '更新時間', value: row.updated_at || '—' },
  ],
  actions: [{ key: 'toggle-status', label: row.status === 1 ? '禁用' : '啓用', icon: row.status === 1 ? CircleClose : CircleCheck, type: row.status === 1 ? 'danger' : 'primary', plain: true }],
})));
function handleAction(_: string, key: string) { const row = props.data.find((item) => String(item.id) === key); if (row) emit('toggle-status', row); }
</script>

<style scoped lang="scss">
.currency-card-list { display: none; @include mobile { display: block; } }
</style>
