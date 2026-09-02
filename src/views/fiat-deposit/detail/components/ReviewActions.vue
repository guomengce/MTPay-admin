<template>
  <el-dialog :model-value="modelValue" :title="mode === 'approve' ? '審核通過' : '審核拒絕'" width="440px" append-to-body destroy-on-close @close="close">
    <p class="review-dialog__message">{{ mode === 'approve' ? '確認通過該法幣入金申請？' : '請填寫拒絕原因。' }}</p>
    <el-input v-if="mode === 'reject'" v-model="note" type="textarea" :rows="3" maxlength="1000" show-word-limit placeholder="拒絕原因" />
    <template #footer><el-button :disabled="submitting" @click="close">取消</el-button><el-button :type="mode === 'approve' ? 'primary' : 'danger'" :loading="submitting" @click="submit">確認</el-button></template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
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