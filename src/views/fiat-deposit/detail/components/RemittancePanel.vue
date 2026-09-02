<template>
  <AdminPanel title="匯款資料" subtitle="付款信息與銀行匯款憑證" :icon="CreditCard">
    <dl class="remittance-panel__fields">
      <div><dt>付款人</dt><dd>{{ detail.payer_name || '—' }}</dd></div>
      <div><dt>付款銀行</dt><dd>{{ detail.payer_bank || '—' }}</dd></div>
      <div><dt>賬户後四位</dt><dd class="is-mono">{{ detail.payer_account_last4 || '—' }}</dd></div>
      <div><dt>匯款參考號</dt><dd class="is-mono">{{ detail.remittance_reference || '—' }}</dd></div>
      <div><dt>匯款日期</dt><dd>{{ detail.remittance_date || '—' }}</dd></div>
      <div><dt>最後更新</dt><dd>{{ detail.updated_at || '—' }}</dd></div>
      <div class="is-wide"><dt>備註</dt><dd>{{ detail.remark || '—' }}</dd></div>
      <div v-if="detail.review.note" class="is-wide"><dt>{{ detail.status === 2 ? '駁回原因' : '審核備註' }}</dt><dd>{{ detail.review.note }}</dd></div>
    </dl>
    <section v-if="detail.files.length" class="remittance-panel__files">
      <h4><el-icon><Document /></el-icon>匯款憑證</h4>
      <article v-for="file in detail.files" :key="file.file_id">
        <span class="remittance-panel__file-icon"><el-icon><Document /></el-icon></span>
        <div><strong>{{ file.original_name }}</strong><small>{{ file.extension.toUpperCase() }} · {{ formatSize(file.size) }}</small></div>
        <div class="remittance-panel__actions"><el-button plain type="primary" size="small" :icon="View" @click="emit('preview',file.file_id)">預覽</el-button><el-button plain size="small" :icon="Download" @click="emit('download',file.file_id,file.original_name)">下載</el-button></div>
      </article>
    </section>
  </AdminPanel>
</template>
<script setup lang="ts">
import { CreditCard, Document, Download, View } from '@element-plus/icons-vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { FiatOrderDetail } from '@/api/modules/fiatDeposit';
defineProps<{ detail: FiatOrderDetail }>();
const emit=defineEmits<{(e:'preview',id:number):void;(e:'download',id:number,name:string):void}>();
function formatSize(size:number){if(size<1024)return `${size} B`;if(size<1024*1024)return `${(size/1024).toFixed(1)} KB`;return `${(size/1024/1024).toFixed(1)} MB`;}
</script>
<style scoped lang="scss">
.remittance-panel {
  &__fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); margin:0; padding:8px 24px 20px; gap:0 28px; }
  &__fields>div { display:grid; min-width:0; grid-template-columns:120px minmax(0,1fr); gap:14px; padding:15px 0; border-bottom:1px solid #e8edf3; }
  &__fields .is-wide { grid-column:1/-1; } dt{color:var(--app-text-label);font-size:13px;} dd{margin:0;color:var(--app-text-body);font-weight:600;overflow-wrap:anywhere;} dd.is-mono{font-family:ui-monospace,Consolas,monospace;word-break:break-all;}
  &__files { padding:0 24px 24px; } &__files h4{display:flex;align-items:center;gap:8px;margin:0 0 10px;color:var(--app-text-heading);}
  &__files article { display:grid; grid-template-columns:38px minmax(0,1fr) auto; align-items:center; gap:12px; padding:12px 14px; border:1px solid #dce6f0; border-radius:12px; background:#f8fbfd; &+article{margin-top:8px;} }
  &__file-icon{display:grid;width:36px;height:36px;place-items:center;border-radius:10px;color:#168fca;background:#e9f5ff;} &__files strong{display:block;overflow-wrap:anywhere;} &__files small{display:block;margin-top:3px;color:var(--app-text-label);} &__actions{display:flex;gap:8px;}
}
@include mobile { .remittance-panel { &__fields{grid-template-columns:1fr;padding:6px 18px 16px;} &__fields>div{grid-template-columns:minmax(96px,36%) minmax(0,1fr);align-items:baseline;gap:12px;} &__files{padding:0 18px 18px;} &__files article{grid-template-columns:36px minmax(0,1fr);} &__actions{grid-column:1/-1;} } }
</style>
