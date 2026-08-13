<template>
  <main class="login-page">
    <LoginBrandPanel />
    <LoginCard class="login-page__card" />
  </main>
</template>

<script setup lang="ts">
import LoginBrandPanel from './components/LoginBrandPanel.vue';
import LoginCard from './components/LoginCard.vue';
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  overflow: hidden;
  background: #f7fbff;

  &::before,
  &::after {
    position: absolute;
    z-index: 0;
    pointer-events: none;
    content: '';
  }

  &::before {
    top: 0;
    right: 0;
    bottom: 0;
    left: 50%;
    background:
      radial-gradient(circle at 88% 12%, rgb(20 190 177 / 12%), transparent 24%),
      radial-gradient(circle at 16% 88%, rgb(42 126 202 / 9%), transparent 27%),
      linear-gradient(90deg, rgb(8 52 93 / 3.5%) 1px, transparent 1px),
      linear-gradient(0deg, rgb(8 52 93 / 3.5%) 1px, transparent 1px);
    background-size: auto, auto, 72px 72px, 72px 72px;
  }

  &::after {
    top: 9%;
    right: 5%;
    width: 150px;
    height: 150px;
    border: 1px solid rgb(13 174 163 / 16%);
    border-radius: 36px;
    box-shadow:
      -24px 24px 0 -1px #f7fbff,
      -24px 24px 0 0 rgb(13 174 163 / 9%);
    transform: rotate(18deg);
  }

  &__card {
    position: relative;
    z-index: 1;
    align-self: center;
    justify-self: center;
  }

  @include mobile {
    display: block;
    min-height: 100svh;
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 72px;

    &::before,
    &::after { display: none; }

    &__card {
      position: relative;
      z-index: 2;
      width: calc(100% - 32px);
      margin: -70px auto 0;
    }
  }
}
</style>
