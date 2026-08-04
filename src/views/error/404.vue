<template>
  <section class="error-page">
    <h1>404</h1>
    <p>页面不存在</p>
    <RouterLink to="/dashboard">返回营运总览</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped lang="scss">
.error-page {
  display: grid;
  min-height: 100vh;
  place-content: center;
  gap: 12px;
  text-align: center;

  h1 {
    margin: 0;
    color: #071833;
    font-size: 72px;
  }

  a {
    color: #126df0;
    font-weight: 900;
  }
}
</style>
