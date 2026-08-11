<template>
  <main class="login-page">
    <section class="login-page__story">
      <div class="login-page__brand">
        <span>M</span>
        <strong>MTPay Admin</strong>
      </div>
      <p class="login-page__eyebrow">OPERATIONS &amp; REVIEW CONSOLE</p>
      <h1>集中管理代理与每一笔资金流程。</h1>
      <p class="login-page__copy">
        建立代理帐户、设定专属兑换比例，并一次审核白名单、兑换及 USD 出金。
      </p>
      <div class="login-page__chips">
        <span>代理后台</span>
        <span>比例与费用</span>
        <span>审核流程</span>
        <span>完整时间线</span>
      </div>
    </section>

    <section class="login-page__form-wrap">
      <span class="login-page__dots" aria-hidden="true" />
      <span class="login-page__shield-mark" aria-hidden="true">
        <el-icon><Lock /></el-icon>
      </span>
      <el-form class="login-card" :model="form" label-position="top" @submit.prevent="handleLogin">
        <span class="login-card__shield">
          <el-icon><Lock /></el-icon>
        </span>
        <h2 class="login-card__title">登入管理后台</h2>
        <p class="login-card__desc">目前不区分管理员角色，所有重要操作仍会保留记录。</p>

        <el-form-item label="管理员 Email" prop="email">
          <el-input v-model="form.email" size="large" :prefix-icon="User" placeholder="admin@mtpay.test" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            size="large"
            type="password"
            show-password
            :prefix-icon="Lock"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-button native-type="submit" type="primary" size="large" class="login-card__submit">
          登入管理后台
        </el-button>
      </el-form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Lock, User } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/modules/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const form = reactive({
  email: 'admin@mtpay.test',
  password: '••••••••',
});

async function handleLogin() {
  authStore.login({
    token: 'mtpay-admin-demo-token',
    userInfo: {
      id: 'admin',
      name: 'MTPay 管理员',
      role: 'admin',
    },
  });
  await router.replace(String(route.query.redirect || '/dashboard'));
}
</script>

<style scoped lang="scss">
.login-page {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(430px, 0.95fr) minmax(520px, 1.05fr);
  background: #f7fbff;

  &__story,
  &__form-wrap {
    position: relative;
    overflow: hidden;
  }

  &__story {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px;
    color: #ffffff;
    background:
      linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px),
      linear-gradient(0deg, rgb(255 255 255 / 4%) 1px, transparent 1px),
      radial-gradient(circle at 82% 12%, rgb(20 146 221 / 28%), transparent 34%),
      linear-gradient(145deg, #061633, #062d5d);
    background-size:
      64px 64px,
      64px 64px,
      auto,
      auto;
  }

  &__brand {
    position: absolute;
    top: 58px;
    left: 64px;
    display: flex;
    align-items: center;
    gap: 14px;

    span {
      display: inline-flex;
      width: 48px;
      height: 48px;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      color: #00152d;
      background: linear-gradient(135deg, #24d6c1, #10aab8);
      font-size: 26px;
      font-weight: 950;
    }

    strong {
      font-size: 28px;
    }
  }

  &__eyebrow {
    margin: 0 0 24px;
    color: #21f3df;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 6px;
  }

  h1 {
    max-width: 620px;
    margin: 0;
    font-size: 52px;
    font-weight: 950;
    line-height: 1.18;
  }

  &__copy {
    max-width: 560px;
    margin: 32px 0;
    color: #d7e2f1;
    font-size: 19px;
    font-weight: 650;
    line-height: 1.8;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;

    span {
      padding: 11px 18px;
      border: 1px solid rgb(152 190 231 / 32%);
      border-radius: 8px;
      color: #e7f2ff;
      font-weight: 800;
    }
  }

  &__form-wrap {
    display: grid;
    place-items: center;
    padding: 40px;
    background:
      radial-gradient(circle at 95% 0%, rgb(16 169 155 / 7%), transparent 28%),
      linear-gradient(135deg, #ffffff, #f3f8fc);
  }

  &__dots {
    position: absolute;
    top: 36px;
    right: 36px;
    width: 260px;
    height: 260px;
    pointer-events: none;
    background-image: radial-gradient(circle, #c7d4e4 1.4px, transparent 1.5px);
    background-size: 18px 18px;
    opacity: 0.85;
    mask-image: linear-gradient(135deg, #000 30%, transparent 75%);
    -webkit-mask-image: linear-gradient(135deg, #000 30%, transparent 75%);
  }

  &__shield-mark {
    position: absolute;
    top: 70px;
    right: 86px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    color: #10a99b;
    background: rgb(16 169 155 / 8%);
    font-size: 56px;
    pointer-events: none;
  }
}

.login-card {
  position: relative;
  width: min(540px, 100%);
  padding: 48px 52px 40px;
  border: 1px solid #e6ecf5;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 28px 60px rgb(13 42 86 / 8%);

  &__shield {
    display: inline-flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--app-primary);
    background: var(--app-primary-soft);
    font-size: 22px;
  }

  &__title {
    margin: 18px 0 8px;
    color: #061735;
    font-size: 32px;
    font-weight: 950;
    line-height: 1.2;
  }

  &__desc {
    margin: 0 0 28px;
    color: #50617b;
    font-size: 14px;
    line-height: 1.7;
  }

  :deep(.el-form-item) {
    margin-bottom: 22px;
  }

  :deep(.el-form-item__label) {
    color: #071833;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.4;
    padding-bottom: 8px;
  }

  :deep(.el-input__wrapper) {
    padding: 2px 14px;
    border-radius: 10px;
    background: #f6f9fc;
    box-shadow: 0 0 0 1px #e6ecf5 inset;
    transition: box-shadow 0.18s ease;

    &:hover {
      box-shadow: 0 0 0 1px #c4d1e0 inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px var(--app-primary) inset;
    }
  }

  :deep(.el-input__inner) {
    height: 42px;
    color: #0b1b35;
    font-size: 15px;
  }

  :deep(.el-input__prefix-inner > .el-icon),
  :deep(.el-input__prefix) {
    color: #94a4b9;
  }

  &__submit {
    width: 100%;
    height: 50px;
    margin-top: 12px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 1px;
  }
}

@include mobile {
  .login-page {
    grid-template-columns: 1fr;

    &__story {
      min-height: 46vh;
      padding: 112px 24px 36px;
    }

    &__brand {
      top: 28px;
      left: 24px;
    }

    h1 {
      font-size: 34px;
    }

    &__copy {
      margin: 18px 0;
      font-size: 15px;
    }

    &__form-wrap {
      padding: 24px;
    }

    &__dots,
    &__shield-mark {
      display: none;
    }
  }

  .login-card {
    padding: 32px 24px 28px;
    border-radius: 16px;

    &__title {
      font-size: 26px;
    }
  }
}
</style>