<template>
  <el-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="560px"
    :close-on-click-modal="false"
    align-center
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <template v-if="row">
      <p class="exchange-dialog__hint">
        {{
          mode === 'view'
            ? '订单使用提交时的代理专属比例，后续修改比例不影响已提交订单。'
            : mode === 'approve'
              ? '审核通过后，资金将按提交时的比例完成兑换并记入代理流水。'
              : '拒绝后将通知代理重新提交，请填写拒绝原因。'
        }}
      </p>

      <el-form
        v-if="mode === 'reject'"
        ref="formRef"
        class="exchange-dialog__form"
        :model="reasonForm"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="拒绝原因" prop="reason">
          <el-input
            v-model="reasonForm.reason"
            type="textarea"
            :rows="3"
            placeholder="例如：金额与代理可用余额不符"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <dl v-else class="exchange-dialog__detail">
        <div>
          <dt>编号</dt>
          <dd>{{ row.id }}</dd>
        </div>
        <div>
          <dt>提交时间</dt>
          <dd>{{ row.time }}</dd>
        </div>
        <div>
          <dt>代理</dt>
          <dd>{{ row.agent }} <small>{{ row.code }}</small></dd>
        </div>
        <div>
          <dt>支付金额</dt>
          <dd class="strong">{{ row.amount }} {{ row.asset }}</dd>
        </div>
        <div>
          <dt>使用比例</dt>
          <dd>{{ row.rate }}</dd>
        </div>
        <div>
          <dt>获得 USD</dt>
          <dd class="strong">{{ row.usd }}</dd>
        </div>
      </dl>
    </template>

    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button v-if="mode === 'view'" type="primary" @click="emit('update:modelValue', false)">关闭</el-button>
      <el-button v-else-if="mode === 'approve'" type="success" @click="handleSubmit">确认通过</el-button>
      <el-button v-else type="danger" @click="handleSubmit">确认拒绝</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

import type { ExchangeRow } from './ExchangeTableList.vue';

type Mode = 'view' | 'approve' | 'reject';

const props = defineProps<{
  modelValue: boolean;
  row: ExchangeRow | null;
  mode: Mode;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit', payload: { row: ExchangeRow; mode: Mode; reason?: string }): void;
}>();

const dialogTitle = computed(() =>
  props.mode === 'view' ? '兑换详情' : props.mode === 'approve' ? '审核通过' : '拒绝兑换',
);

const formRef = ref<FormInstance>();
const reasonForm = reactive({ reason: '' });

const rules: FormRules<{ reason: string }> = {
  reason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
};

async function handleSubmit() {
  if (!props.row) return;
  if (props.mode === 'reject') {
    if (!formRef.value) return;
    await formRef.value.validate((valid) => {
      if (valid) {
        emit('submit', { row: props.row!, mode: 'reject', reason: reasonForm.reason });
      }
    });
    return;
  }
  emit('submit', { row: props.row, mode: props.mode });
}
</script>

<style scoped lang="scss">
.exchange-dialog {
  &__hint {
    margin: 0 0 18px;
    padding: 10px 14px;
    border-radius: 8px;
    color: #50617b;
    background: #f3f8fc;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.6;
  }

  &__detail {
    display: grid;
    margin: 0;
    padding: 4px 0;
    border-top: 1px solid #eef2f7;

    div {
      display: grid;
      grid-template-columns: 110px 1fr;
      align-items: center;
      gap: 12px;
      padding: 12px 4px;
      border-bottom: 1px solid #eef2f7;
    }

    dt {
      color: #6f7e94;
      font-size: 13px;
      font-weight: 800;
    }

    dd {
      margin: 0;
      color: #1f2a37;
      font-size: 14px;
      font-weight: 700;

      &.strong {
        color: #071833;
        font-size: 16px;
        font-weight: 900;
      }

      small {
        margin-left: 6px;
        color: #7a8aa1;
        font-size: 12px;
        font-weight: 700;
      }
    }
  }

  &__form {
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
    :deep(.el-form-item__label) {
      color: #071833;
      font-weight: 800;
      padding-bottom: 6px;
    }
  }
}
</style>