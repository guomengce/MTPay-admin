<template>
  <AdminDialog
    :model-value="modelValue"
    :title="mode === 'approve' ? '通過法幣入金' : '拒絕法幣入金'"
    :icon="mode === 'approve' ? CircleCheck : CircleClose"
    :tone="mode === 'approve' ? 'success' : 'danger'"
    width="min(440px, calc(100vw - 24px))"
    @update:model-value="close"
  >
    <p class="review-dialog__message">{{ mode === 'approve' ? '確認通過這筆法幣入金申請嗎？' : '請填寫拒絕原因。' }}</p>
    <el-input v-if="mode === 'reject'" v-model="note" type="textarea" :rows="3" maxlength="1000" show-word-limit placeholder="拒絕原因" />
    <template #footer><el-button :disabled="submitting" @click="close">取消</el-button><el-button :type="mode === 'approve' ? 'primary' : 'danger'" :loading="submitting" @click="submit">{{ mode === 'approve' ? '確認通過' : '確認拒絕' }}</el-button></template>
  </AdminDialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import AdminDialog from '@/components/admin/AdminDialog.vue';
const props=defineProps<{modelValue:boolean;mode:'approve'|'reject';submitting:boolean}>();
const emit=defineEmits<{(e:'update:modelValue',value:boolean):void;(e:'review',value:{decision:'approve'|'reject';review_note?:string}):void}>();
const note=ref('');
watch(()=>props.modelValue,(visible)=>{if(visible)note.value='';});
function close(){if(!props.submitting)emit('update:modelValue',false);}
function submit(){const value=note.value.trim();if(props.mode==='reject'&&!value){ElMessage.warning('請填寫拒絕原因');return;}emit('review',{decision:props.mode,review_note:value||undefined});}
</script>
<style scoped lang="scss">
.review-dialog__message{margin:0 0 16px;color:var(--app-text-body);line-height:1.6;}
</style>
