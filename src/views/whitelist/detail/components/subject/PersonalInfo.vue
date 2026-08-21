<template>
  <section class="subject-section">
    <header class="subject-section__header">
      <span class="subject-section__icon"><el-icon><Postcard /></el-icon></span>
      <div><h3>个人资料</h3><p>代理提交的姓名、国籍与证件信息</p></div>
    </header>
    <dl class="subject-section__grid">
      <div v-for="field in fields" :key="field.key" :class="fieldClass(field)">
        <dt>{{ field.label }}</dt>
        <dd :class="{ 'is-mono': field.mono }">{{ field.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { Postcard } from '@element-plus/icons-vue';

import type { WhitelistDetailField } from '../../../composables/useWhitelistDetailView';

defineProps<{
  fields: WhitelistDetailField[];
}>();

function fieldClass(field: WhitelistDetailField) {
  return { 'is-wide': field.wide, 'is-missing': field.missing };
}
</script>
