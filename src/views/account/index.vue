<template>
  <main class="account-page">
    <h1>賬户與安全</h1>
    <div class="account-page__grid">
      <!-- <section class="password-card">
        <header class="password-card__header">
          <span class="password-card__header-icon"><el-icon><Lock /></el-icon></span>
          <h2>修改密碼</h2>
        </header>
        <div class="password-card__body">
          <div class="password-card__item">
            <span class="password-card__item-icon"><el-icon><Key /></el-icon></span>
            <strong>登錄密碼</strong>
            <el-tooltip content="當前管理員修改密碼接口尚未提供" placement="top">
              <span class="password-card__action"><el-button type="primary" plain disabled :icon="EditPen">修改密碼</el-button></span>
            </el-tooltip>
          </div>
        </div>
      </section> -->
      <TwoFactorCard />
    </div>
  </main>
</template>
<script setup lang="ts">
import { Lock, EditPen, Key } from '@element-plus/icons-vue';
import TwoFactorCard from './components/TwoFactorCard.vue';
</script>
<style scoped lang="scss">
.account-page { display: grid; gap: 24px; min-width: 0; h1 { margin: 0; font-size: 24px; } }
.account-page__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; align-items: center; }
.password-card {
  min-width: 0; overflow: hidden;
  border: 1px solid rgb(192 211 227 / 70%); border-radius: 20px; background: #fff;
  box-shadow: 0 18px 50px rgb(35 82 126 / 8%);
  &__header {
    display: flex; gap: 14px; align-items: center; padding: 25px 26px; border-bottom: 1px solid #e8f0f5;
    h2 { font-size: 20px; margin: 0; color: #071833; }
  }
  &__header-icon {
    display: inline-flex; width: 46px; height: 46px; flex: 0 0 46px; align-items: center; justify-content: center;
    border-radius: 14px; color: #fff; font-size: 21px;
    background: linear-gradient(135deg, #27b9aa, #1d8db5); box-shadow: 0 9px 20px rgb(29 141 181 / 20%);
  }
  &__body { padding: 22px 24px; }
  &__item {
    display: grid; grid-template-columns: 42px minmax(0, 1fr) auto; align-items: center; gap: 13px;
    padding: 16px; border: 1px solid #e2ecf3; border-radius: 14px; background: #fbfdff;
    strong { font-size: 14px; color: #14263e; }
  }
  &__item-icon { display: inline-flex; width: 42px; height: 42px; align-items: center; justify-content: center; border-radius: 12px; color: #14998f; background: #e8f8f5; font-size: 19px; }
  &__action { display: inline-flex; }
}
@media (max-width: 1000px) { .account-page__grid { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 600px) {
  .password-card__header, .password-card__body { padding: 20px; }
  .password-card__item { grid-template-columns: 42px minmax(0, 1fr); }
  .password-card__action { grid-column: 1 / -1; .el-button { width: 100%; } }
}
</style>
