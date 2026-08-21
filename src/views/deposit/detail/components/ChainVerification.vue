<template>
  <section class="chain-verification">
    <header class="chain-verification__header">
      <span class="chain-verification__icon">
        <el-icon><Link /></el-icon>
      </span>
      <div class="chain-verification__heading">
        <h3>链上核验</h3>
        <p>确认交易哈希与平台收款地址一致</p>
      </div>
    </header>

    <ul class="chain-verification__list">
      <li class="chain-verification__row">
        <span class="chain-verification__label">交易哈希 Txid</span>
        <code class="chain-verification__value">{{ txid }}</code>
        <el-button
          class="chain-verification__copy"
          :icon="DocumentCopy"
          @click="emit('copy', '交易哈希', txid)"
        >
          复制
        </el-button>
      </li>
      <li class="chain-verification__row">
        <span class="chain-verification__label">平台收款地址</span>
        <code class="chain-verification__value">{{ receivingAddress }}</code>
        <el-button
          class="chain-verification__copy"
          :icon="DocumentCopy"
          @click="emit('copy', '平台收款地址', receivingAddress)"
        >
          复制
        </el-button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { DocumentCopy, Link } from '@element-plus/icons-vue';

defineProps<{
  txid: string;
  receivingAddress: string;
}>();

const emit = defineEmits<{
  (event: 'copy', label: string, value: string): void;
}>();
</script>

<style scoped lang="scss">
.chain-verification {
  overflow: hidden;
  border: 1px solid #dce5ef;
  border-radius: 18px;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 12px 28px rgb(16 42 80 / 6%);

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    border-bottom: 1px solid #e4eaf2;
  }

  &__icon {
    display: inline-flex;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: #1f73f2;
    background: linear-gradient(135deg, #e9f4ff, #eef0ff);
    font-size: 20px;
  }

  &__heading {
    display: grid;
    gap: 4px;
    min-width: 0;

    h3 {
      margin: 0;
      color: var(--app-text-heading);
      font-size: 18px;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: var(--app-text-label);
      font-size: 13px;
    }
  }

  &__list {
    margin: 0;
    padding: 0 24px 12px;
    list-style: none;
  }

  &__row {
    display: grid;
    grid-template-columns: minmax(120px, auto) minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
    padding: 18px 0;
    border-bottom: 1px dashed #dde6f0;

    &:last-child {
      border-bottom: 0;
    }
  }

  &__label {
    color: var(--app-text-label);
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
  }

  &__value {
    min-width: 0;
    color: var(--app-text-body);
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    font-size: 16px;
    line-height: 1.65;
    overflow-wrap: anywhere;
    white-space: normal;
    word-break: break-all;
  }

  &__copy {
    height: 32px;
    padding: 0 14px;
    border: none;
    border-radius: 8px;
    color: #1f73f2;
    background: #eaf3ff;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.15s ease;

    &:hover,
    &:focus {
      color: #1f73f2;
      background: #d6e8ff;
    }
  }
}

@include mobile {
  .chain-verification {
    &__header,
    &__list {
      padding-right: 18px;
      padding-left: 18px;
    }

    &__row {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    &__copy {
      justify-self: flex-end;
    }
  }
}
</style>