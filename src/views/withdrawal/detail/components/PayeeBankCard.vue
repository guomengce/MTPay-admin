<template>
  <article class="withdrawal-party-card is-payee is-bank">
    <header>
      <div class="withdrawal-party-card__title"><i></i><h3>收款銀行資料</h3></div>
      <div class="withdrawal-party-card__actions"><el-button circle plain size="small" :icon="DocumentCopy" title="複製收款銀行資料" @click="copyPartyCard('收款銀行資料', fields)" /></div>
    </header>
    <dl class="withdrawal-party-card__fields"><div v-for="item in fields" :key="item.key"><dt>{{ item.label }}</dt><dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd></div></dl>
  </article>
</template>
<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue';
import type { DetailField } from '../../composables/useWithdrawalDetailView';
import { copyPartyCard } from './partyCardCopy';
defineProps<{ fields: DetailField[] }>();
</script>