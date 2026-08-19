<template>
  <el-dialog
    :model-value="modelValue"
    width="560px"
    class="receiving-address-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
    @open="handleOpen"
  >
    <template #header>
      <header class="receiving-address__header">
        <div class="receiving-address__heading">
          <span
            ><el-icon><Position /></el-icon
          ></span>
          <div>
            <h2>{{ replacing ? '更换收款地址' : '设置收款地址' }}</h2>
            <p>
              {{
                replacing
                  ? '新地址保存后，旧地址由后端停用并保留在历史记录中'
                  : '为该币种网络关系设置当前生效的收款地址'
              }}
            </p>
          </div>
        </div>
        <el-button
          circle
          text
          :icon="Close"
          aria-label="关闭"
          @click="emit('update:modelValue', false)"
        />
      </header>
    </template>

    <div class="receiving-address__body">
      <div class="receiving-address__notice">
        <el-icon><InfoFilled /></el-icon>
        <span v-if="replacing && currentAddress">
          当前地址：
          <strong class="is-mono">{{ currentAddress }}</strong>
        </span>
        <span v-else>提交后将立即生效</span>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="收款地址" prop="address">
          <el-input
            v-model="form.address"
            :prefix-icon="Link"
            maxlength="255"
            show-word-limit
            placeholder="请输入完整地址，不能包含空白字符"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item label="备注（可选）" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            :maxlength="500"
            show-word-limit
            placeholder="补充说明，最多 500 字"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <footer class="receiving-address__footer">
        <span>
          <el-icon><Lock /></el-icon>
          数据通过加密连接提交，地址严格按字符串原样存储
        </span>
        <div>
          <el-button @click="emit('update:modelValue', false)">取消</el-button>
          <el-button
            type="primary"
            :icon="replacing ? Edit : Check"
            :loading="submitting"
            @click="handleSubmit"
          >
            {{ replacing ? '更换地址' : '设置地址' }}
          </el-button>
        </div>
      </footer>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Check, Close, Edit, InfoFilled, Link, Lock, Position } from '@element-plus/icons-vue';

defineProps<{
  modelValue: boolean;
  /** 是否为「更换」模式（已有当前地址） */
  replacing: boolean;
  /** 当前的收款地址（replacing=true 时显示在提示区） */
  currentAddress: string | null;
  submitting: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', payload: { address: string; remark?: string }): void;
}>();

const form = reactive({ address: '', remark: '' });
const formRef = ref<FormInstance>();

const rules: FormRules<{ address: string; remark: string }> = {
  address: [
    { required: true, message: '请填写收款地址', trigger: 'blur' },
    {
      validator(_rule, value: string, callback) {
        if (value.length > 255) {
          return callback(new Error('收款地址不可超过 255 字符'));
        }
        if (/\s/.test(value)) {
          return callback(new Error('地址不能包含空白字符'));
        }
        callback();
      },
      trigger: 'blur',
    },
  ],
  remark: [
    {
      validator(_rule, value: string, callback) {
        if (value.length > 500) {
          return callback(new Error('备注不可超过 500 字符'));
        }
        callback();
      },
      trigger: 'blur',
    },
  ],
};

async function handleOpen() {
  form.address = '';
  form.remark = '';
  await nextTick();
  formRef.value?.clearValidate();
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  const remark = form.remark.trim();
  emit('submit', {
    address: form.address.trim(),
    remark: remark ? remark : undefined,
  });
}
</script>

<style lang="scss">
.receiving-address-dialog {
  padding: 0;
}
.receiving-address-dialog .el-dialog__header,
.receiving-address-dialog .el-dialog__body,
.receiving-address-dialog .el-dialog__footer {
  margin: 0;
  padding: 0;
}

.receiving-address {
  &__header {
    display: flex;
    min-height: 96px;
    align-items: center;
    justify-content: space-between;
    padding: 22px 26px;
    color: #ffffff;
    background:
      radial-gradient(circle at 84% 0, rgb(47 224 211 / 25%), transparent 40%),
      linear-gradient(135deg, #061d3d, #0b4165);
  }

  &__header > .el-button {
    color: #d9e9f7;
    font-size: 20px;
  }

  &__heading {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__heading > span {
    display: grid;
    width: 46px;
    height: 46px;
    place-items: center;
    border: 1px solid rgb(255 255 255 / 25%);
    border-radius: 12px;
    background: linear-gradient(135deg, #2bd8c5, #1498be);
    box-shadow: 0 10px 24px rgb(16 214 196 / 20%);
    font-size: 22px;
  }

  &__heading h2 {
    margin: 0;
    font-size: 20px;
  }

  &__heading p {
    margin: 5px 0 0;
    color: #b7cce0;
    font-size: 12px;
  }

  &__body {
    padding: 22px 26px 8px;
    background: #f8fafc;
  }

  &__notice {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-bottom: 18px;
    padding: 12px 14px;
    border: 1px solid #cde9e6;
    border-radius: 11px;
    color: #39706e;
    background: #edf9f7;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.65;
  }

  &__notice .el-icon {
    flex: none;
    margin-top: 3px;
    color: #0ba49a;
    font-size: 16px;
  }

  &__notice strong.is-mono {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  }

  &__form {
    .el-form-item {
      margin-bottom: 18px;
    }
  }

  &__footer {
    display: flex;
    min-height: 78px;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 26px;
    border-top: 1px solid #e3e9f0;
    background: #ffffff;
  }

  &__footer > span {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #8190a3;
    font-size: 12px;
  }

  &__footer > span .el-icon {
    color: #0aa097;
  }

  &__footer > div {
    display: flex;
    gap: 10px;
  }
}

@include mobile {
  .receiving-address-dialog {
    width: calc(100% - 24px) !important;
  }

  .receiving-address__header {
    min-height: 84px;
    padding: 18px;
  }

  .receiving-address__heading > span {
    width: 40px;
    height: 40px;
  }

  .receiving-address__heading h2 {
    font-size: 17px;
  }

  .receiving-address__heading p {
    display: none;
  }

  .receiving-address__body {
    padding: 18px 18px 4px;
  }

  .receiving-address__footer {
    align-items: stretch;
    flex-direction: column;
    padding: 14px 18px;
  }

  .receiving-address__footer > span {
    justify-content: center;
  }

  .receiving-address__footer > div,
  .receiving-address__footer .el-button {
    width: 100%;
  }
}
</style>
