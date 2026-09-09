<template>
  <AdminDialog
    :model-value="modelValue"
    :title="currency ? '修改幣種' : '新增幣種'"
    :icon="Coin"
    tone="brand"
    width="min(560px, calc(100vw - 24px))"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="幣種類型" prop="type">
        <el-select v-model="form.type" :disabled="Boolean(currency)" placeholder="請選擇幣種類型">
          <el-option v-if="authStore.cryptoEnabled || currency?.type === 1" label="數字貨幣" :value="1" /><el-option label="法幣" :value="2" />
        </el-select>
      </el-form-item>
      <div class="add-currency-dialog__grid">
        <el-form-item label="幣種代碼" prop="code"><el-input v-model="form.code" :disabled="Boolean(currency)" maxlength="20" placeholder="例如 USDT" @input="form.code = String($event).toUpperCase()" /></el-form-item>
        <el-form-item label="幣種名稱" prop="name"><el-input v-model="form.name" maxlength="100" placeholder="請輸入幣種名稱" /></el-form-item>
      </div>
      <el-form-item v-if="form.type === 2" label="固定手續費" prop="fee_amount">
        <el-input v-model="form.fee_amount" inputmode="decimal" placeholder="請輸入固定手續費" @input="form.fee_amount = limitDecimalInput(String($event), 8)"><template #append>{{ form.code || '幣種' }}</template></el-input>
      </el-form-item>
    </el-form>
    <template #footer><el-button @click="close">取消</el-button><el-button type="primary" :loading="submitting" @click="submit">{{ currency ? '確認修改' : '確認新增' }}</el-button></template>
  </AdminDialog>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Coin } from '@element-plus/icons-vue';
import type { AddCurrencyPayload, CurrencyItem, CurrencyType } from '@/api/modules/currency';
import AdminDialog from '@/components/admin/AdminDialog.vue';
import { limitDecimalInput } from '@/utils/decimal';
import { useAuthStore } from '@/stores/modules/auth';
const props=defineProps<{modelValue:boolean;submitting:boolean;currency?:CurrencyItem|null}>();
const emit=defineEmits<{(event:'update:modelValue',value:boolean):void;(event:'submit',value:AddCurrencyPayload):void}>();
const formRef=ref<FormInstance>();
const authStore=useAuthStore();
const form=reactive<{type?:CurrencyType;code:string;name:string;fee_amount:string}>({type:undefined,code:'',name:'',fee_amount:''});
const rules:FormRules={type:[{required:true,message:'請選擇幣種類型',trigger:'change'}],code:[{required:true,message:'請輸入幣種代碼',trigger:'blur'}],name:[{required:true,message:'請輸入幣種名稱',trigger:'blur'}],fee_amount:[{validator:(_rule,value,callback)=>{if(form.type!==2)return callback();if(!value)return callback(new Error('請輸入固定手續費'));if(!/^\d+(?:\.\d{1,8})?$/.test(value))return callback(new Error('請輸入正確的手續費，最多 8 位小數'));callback()},trigger:['blur','change']}]};
function sync(){const item=props.currency;form.type=item?.type;form.code=item?.code??'';form.name=item?.name??'';form.fee_amount=item?.fee_amount==null?'':String(item.fee_amount);formRef.value?.clearValidate()}
watch(()=>props.modelValue,(visible)=>{if(visible)sync()});watch(()=>form.type,()=>formRef.value?.clearValidate('fee_amount'));
function close(){emit('update:modelValue',false)}
async function submit(){if(!formRef.value||!(await formRef.value.validate().catch(()=>false))||!form.type)return;emit('submit',{type:form.type,code:form.code.trim(),name:form.name.trim(),...(form.type===2&&form.fee_amount.trim()?{fee_amount:form.fee_amount.trim()}:{})})}
</script>
<style scoped lang="scss">.add-currency-dialog__grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}@include mobile{.add-currency-dialog__grid{grid-template-columns:1fr;gap:0}}</style>
