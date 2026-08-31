<template>
  <section class="chain-verification">
    <header class="chain-verification__header">
      <span class="chain-verification__icon">
        <el-icon><Link /></el-icon>
      </span>
      <h3>鏈上交易資料</h3>
    </header>

    <div class="chain-verification__body">
      <div class="chain-verification__flow">
        <article class="chain-verification__address">
          <span class="chain-verification__eyebrow">從</span><strong>轉出地址</strong>
          <div class="chain-verification__address-value"><code>{{ sourceAddress || '—' }}</code><el-button v-if="sourceAddress" text circle :icon="DocumentCopy" aria-label="複製轉出地址" @click="emit('copy', '轉出地址', sourceAddress)" /></div>
        </article>
        <span class="chain-verification__direction" aria-hidden="true"><el-icon><Right /></el-icon></span>
        <article class="chain-verification__address">
          <span class="chain-verification__eyebrow">到</span><strong>代理专属地址</strong>
          <div class="chain-verification__address-value"><code>{{ receivingAddress || '—' }}</code><el-button v-if="receivingAddress" text circle :icon="DocumentCopy" aria-label="複製平台收款地址" @click="emit('copy', '平台收款地址', receivingAddress)" /></div>
        </article>
      </div>
      <dl class="chain-verification__meta">
        <div><dt>平台交易號</dt><dd><code>{{ platformTransactionNo || '—' }}</code><el-button v-if="platformTransactionNo" text circle :icon="DocumentCopy" aria-label="複製平台交易號" @click="emit('copy', '平台交易號', platformTransactionNo)" /></dd></div>
        <div><dt>交易哈希 Txid</dt><dd><code>{{ txid || '—' }}</code><el-button v-if="txid" text circle :icon="DocumentCopy" aria-label="複製交易雜湊" @click="emit('copy', '交易雜湊', txid)" /></dd></div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DocumentCopy, Link, Right } from '@element-plus/icons-vue';

defineProps<{
  txid: string;
  platformTransactionNo: string;
  sourceAddress: string;
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

    h3 { margin: 0; color: var(--app-text-heading); font-size: 18px; font-weight: 700; }
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

  &__body { display: grid; gap: 18px; padding: 20px 24px 24px; }

  &__flow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 38px minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    padding: 18px;
    border-radius: 14px;
    background: #f5f8fc;
  }

  &__address {
    display: grid;
    min-width: 0;
    gap: 8px;

    strong { color: var(--app-text-heading); font-size: 14px; }
  }

  &__eyebrow { color: var(--app-text-label); font-size: 13px; }

  &__address-value,
  &__meta dd {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 6px;

    code { min-width: 0; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; overflow-wrap: anywhere; word-break: break-all; }
    .el-button { flex: 0 0 auto; color: #079b92; }
  }

  &__direction {
    display: inline-flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border: 1px solid #a9ded9;
    border-radius: 50%;
    color: #099e95;
    background: #fff;
  }

  &__meta {
    display: grid;
    margin: 0;
    gap: 0;

    > div {
      display: grid;
      min-width: 0;
      grid-template-columns: 150px minmax(0, 1fr);
      align-items: center;
      gap: 16px;
      padding: 15px 4px;
      border-bottom: 1px solid #e8edf3;

      &:last-child { border-bottom: 0; }
    }

    dt { color: var(--app-text-label); font-size: 13px; }
    dd {
      justify-content: space-between;
      margin: 0;
      color: var(--app-text-body);
      font-size: 14px;
      font-weight: 600;

      .el-button { margin-left: auto; }
    }
  }
}

@include mobile {
  .chain-verification {
    &__header,
    &__body {
      padding-right: 18px;
      padding-left: 18px;
    }

    &__flow { grid-template-columns: 1fr; }

    &__direction { transform: rotate(90deg); justify-self: center; }
    &__meta > div { grid-template-columns: 1fr; gap: 8px; }
  }
}
</style>
