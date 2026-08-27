<template>
  <article class="withdrawal-party-card is-payee">
    <header>
      <div class="withdrawal-party-card__title"><i></i><h3>收款方個人資料</h3></div>
      <div class="withdrawal-party-card__actions">
        <IdentityBadge role="收款方" entity-type="個人" />
        <el-button circle plain size="small" :icon="DocumentCopy" title="複製收款方全部資料" @click="copyPartyCard('收款方', fields, bankFields)" />
      </div>
    </header>
    <dl class="withdrawal-party-card__fields">
      <div v-for="item in fields" :key="item.key"><dt>{{ item.label }}</dt><dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd></div>
    </dl>
    <section class="withdrawal-party-card__bank">
      <h4>收款銀行資料</h4>
      <dl class="withdrawal-party-card__fields">
        <div v-for="item in bankFields" :key="item.key"><dt>{{ item.label }}</dt><dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd></div>
      </dl>
    </section>
  </article>
</template>
<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';
import type { DetailField } from '../../composables/useWithdrawalDetailView';
import { copyPartyCard } from './partyCardCopy';
defineProps<{ fields: DetailField[]; bankFields: DetailField[] }>();
</script>
