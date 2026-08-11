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
      <p class="withdrawal-dialog__hint">
        {{
          mode === 'view'
            ? '每笔订单均可查看付款人、收款人、资金变化和完整处理时间线。'
            : '确认后系统将标记订单为「已完成」，并写入资金流水；该操作不可撤销。'
        }}
      </p>

      <dl class="withdrawal-dialog__detail">
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
          <dd>{{ row.agent }}</dd>
        </div>
        <div>
          <dt>付款关系</dt>
          <dd>
            <span class="relation-chip">{{ row.relation }}</span>
            <small>{{ row.parties }}</small>
          </dd>
        </div>
        <div>
          <dt>收款金额</dt>
          <dd class="strong">{{ row.amount }}</dd>
        </div>
        <div>
          <dt>费用 / 总扣款</dt>
          <dd>{{ row.fee }}</dd>
        </div>
      </dl>

      <el-form
        v-if="mode === 'complete'"
        ref="formRef"
        class="withdrawal-dialog__form"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="付款凭证号" prop="reference">
          <el-input v-model="form.reference" placeholder="例如：银行流水号 / 渠道交易号" maxlength="60" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            v-model="form.note"
            type="textarea"
            :rows="2"
            placeholder="可选：填写实际付款渠道或异常说明"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button v-if="mode === 'view'" type="primary" @click="emit('update:modelValue', false)">关闭</el-button>
      <el-button v-else type="primary" @click="handleSubmit">确认付款完成</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

import type { WithdrawalRow } from './WithdrawalTableList.vue';

type Mode = 'view' | 'complete';

const props = defineProps<{
  modelValue: boolean;
  row: WithdrawalRow | null;
  mode: Mode;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit', payload: { row: WithdrawalRow; mode: Mode; reference?: string; note?: string }): void;
}>();

const dialogTitle = computed(() =>
  props.mode === 'view' ? '出金订单详情' : '标记付款完成',
);

const formRef = ref<FormInstance>();
const form = reactive({ reference: '', note: '' });

const rules: FormRules<{ reference: string; note?: string }> = {
  reference: [{ required: true, message: '请填写付款凭证号', trigger: 'blur' }],
};

async function handleSubmit() {
  if (!props.row) return;
  if (props.mode === 'complete') {
    if (!formRef.value) return;
    await formRef.value.validate((valid) => {
      if (valid) {
        emit('submit', {
          row: props.row!,
          mode: 'complete',
          reference: form.reference,
          note: form.note,
        });
      }
    });
    return;
  }
  emit('submit', { row: props.row, mode: props.mode });
}
</script>

<style scoped lang="scss">
.withdrawal-dialog {
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
    padding: 4px 0 12px;
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

      .relation-chip {
        display: inline-flex;
        height: 22px;
        align-items: center;
        padding: 0 10px;
        margin-right: 8px;
        border-radius: 999px;
        color: #126df0;
        background: #eaf2ff;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.5px;
        vertical-align: middle;
      }

      small {
        color: #7a8aa1;
        font-size: 12px;
        font-weight: 700;
      }
    }
  }

  &__form {
    :deep(.el-form-item) {
      margin-bottom: 14px;
    }
    :deep(.el-form-item:last-child) {
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