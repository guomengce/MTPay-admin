<template>
  <el-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="min(440px, calc(100vw - 24px))"
    :close-on-click-modal="false"
    align-center
    @open="reset"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="row">
      <p v-if="mode === 'approve'">確認通過此法幣出金申請？</p>
      <p v-if="mode === 'payment'">{{ form.result === 'fail' ? '付款失敗後將釋放凍結資金，原訂單不可重試。' : '請確認已實際完成付款。' }}</p>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
        <el-form-item
          v-if="mode === 'reject' || mode === 'supplement'"
          :label="mode === 'reject' ? '駁回原因' : '補件要求'"
          prop="message"
        >
          <el-input
            v-model="form.message"
            type="textarea"
            :rows="3"
            maxlength="1000"
            show-word-limit
            :placeholder="mode === 'reject' ? '請説明駁回原因' : '請輸入補件要求'"
          />
        </el-form-item>

        <template v-if="mode === 'payment'">
          <el-form-item label="付款結果" prop="result">
            <el-radio-group v-model="form.result">
              <el-radio-button value="complete">付款完成</el-radio-button>
              <el-radio-button value="fail">付款失敗</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.result === 'fail'" label="失敗原因" prop="failureReason">
            <el-input
              v-model="form.failureReason"
              type="textarea"
              :rows="3"
              maxlength="1000"
              show-word-limit
              placeholder="請輸入失敗原因"
            />
          </el-form-item>
        </template>

        <el-form-item
          v-if="(mode === 'payment' && form.result === 'complete') || mode === 'append'"
          :label="mode === 'append' ? '追加付款憑證' : '付款憑證（選填）'"
        >
          <el-upload
            v-model:file-list="fileList"
            :auto-upload="false"
            multiple
            :limit="5"
            accept=".pdf,.png,.jpg,.jpeg"
            @change="handleFileChange"
          >
            <el-button plain :icon="Upload">選擇文件</el-button>
            <template #tip>
              <p class="withdrawal-action__file-tip">
                PDF / PNG / JPG / JPEG，最多 5 個，每個 ≤ 10 MB
              </p>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item v-if="mode === 'append'" label="追加説明（選填）" prop="message">
          <el-input
            v-model="form.message"
            type="textarea"
            :rows="3"
            maxlength="1000"
            show-word-limit
            placeholder="請輸入説明"
          />
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button plain @click="emit('update:modelValue', false)">取消</el-button>
      <el-button
        :type="submitType"
        :icon="submitIcon"
        :loading="submitting || uploading"
        @click="handleSubmit"
        >{{ submitLabel }}</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/** 法幣出金詳情動作彈框：表單只收集輸入，接口和文件上傳由詳情 composable 統一執行。 */
import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules, UploadFile, UploadFiles, UploadUserFile } from 'element-plus';
import { CircleCheck, CircleClose, DocumentAdd, Upload } from '@element-plus/icons-vue';

import type { WithdrawalFile, WithdrawalPaymentResult } from '@/api/modules/withdrawal';
import type { WithdrawalRow } from '../composables/mapper';

export type WithdrawalActionMode = 'approve' | 'reject' | 'supplement' | 'payment' | 'append';

const props = defineProps<{
  modelValue: boolean;
  row: WithdrawalRow | null;
  mode: WithdrawalActionMode;
  submitting?: boolean;
  uploading?: boolean;
  /** 打開付款彈窗時的預選結果（列表快捷按鈕直接點“付款失敗”時預選 fail）。 */
  initialResult?: WithdrawalPaymentResult;
  uploadFile: (file: File) => Promise<WithdrawalFile>;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (
    e: 'submit',
    payload: {
      mode: WithdrawalActionMode;
      message?: string;
      result?: WithdrawalPaymentResult;
      failureReason?: string;
      fileIds: number[];
    },
  ): void;
}>();

const formRef = ref<FormInstance>();
const fileList = ref<UploadUserFile[]>([]);
const form = reactive({
  message: '',
  result: 'complete' as WithdrawalPaymentResult,
  failureReason: '',
});

const dialogTitle = computed(
  () =>
    ({
      approve: '審核通過',
      reject: '駁回法幣出金',
      supplement: '要求補件',
      payment: '登記付款結果',
      append: '追加付款憑證',
    })[props.mode],
);
const submitLabel = computed(
  () =>
    ({
      approve: '確認通過',
      reject: '確認駁回',
      supplement: '發送補件要求',
      payment: '提交付款結果',
      append: '上傳並追加',
    })[props.mode],
);
const submitType = computed(() => (props.mode === 'reject' ? 'danger' : 'primary'));
const submitIcon = computed(() =>
  props.mode === 'reject'
    ? CircleClose
    : props.mode === 'supplement' || props.mode === 'append'
      ? DocumentAdd
      : CircleCheck,
);

const rules = computed<FormRules>(() => ({
  message:
    props.mode === 'reject' || props.mode === 'supplement'
      ? [{ required: true, message: '請填寫處理説明', trigger: 'blur' }]
      : [],
  failureReason:
    props.mode === 'payment' && form.result === 'fail'
      ? [{ required: true, message: '請填寫付款失敗原因', trigger: 'blur' }]
      : [],
}));

function reset() {
  form.message = '';
  form.result = props.initialResult ?? 'complete';
  form.failureReason = '';
  fileList.value = [];
  formRef.value?.clearValidate();
}

async function handleFileChange(file:UploadFile,files:UploadFiles){fileList.value=files;if(!file.raw||file.status==='success')return;if(file.raw.size>10*1024*1024){ElMessage.warning('單個文件不能超過 10 MB');fileList.value=fileList.value.filter(item=>item.uid!==file.uid);return}try{file.status='uploading';file.response=await props.uploadFile(file.raw);file.status='success'}catch{file.status='fail';fileList.value=fileList.value.filter(item=>item.uid!==file.uid)}}

async function handleSubmit() {
  if (!props.row) return;
  if (formRef.value && !(await formRef.value.validate().catch(() => false))) return;
  const fileIds=fileList.value.map(item=>(item.response as WithdrawalFile|undefined)?.file_id).filter((id):id is number=>typeof id==='number');
  if (props.mode === 'append' && fileIds.length === 0) {
    ElMessage.warning('請至少選擇一個付款憑證');
    return;
  }
  emit('submit', {
    mode: props.mode,
    message: form.message.trim() || undefined,
    result: props.mode === 'payment' ? form.result : undefined,
    failureReason: form.failureReason.trim() || undefined,
    fileIds,
  });
}
</script>

<style scoped lang="scss">
.withdrawal-action {
  &__file-tip {
    margin: 7px 0 0;
    color: var(--app-text-label);
    font-size: 12px;
  }
}

</style>
