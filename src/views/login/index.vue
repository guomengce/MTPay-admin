<template>
  <main class="login-page">
    <section class="login-page__story">
      <div class="login-page__brand">
        <span>M</span>
        <strong>MTPay Admin</strong>
      </div>
      <p class="login-page__eyebrow">OPERATIONS & REVIEW CONSOLE</p>
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
      <el-form class="login-card" :model="form" label-position="top" @submit.prevent="handleLogin">
        <span class="login-card__shield">
          <el-icon><Lock /></el-icon>
        </span>
        <p class="login-card__mini">安全登录</p>
        <h2>登入管理后台</h2>
        <p class="login-card__desc">目前不区分管理员角色，所有重要操作仍会保留记录。</p>

        <el-form-item label="管理员 Email" prop="email">
          <el-input v-model="form.email" size="large" :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            size="large"
            type="password"
            show-password
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-button native-type="submit" type="primary" size="large">登入管理后台</el-button>
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
      radial-gradient(circle at 90% 5%, rgb(15 169 154 / 10%), transparent 20%),
      linear-gradient(135deg, #ffffff, #f1f7fc);
  }
}

.login-card {
  position: relative;
  width: min(620px, 100%);
  padding: 56px 58px 46px;
  border: 1px solid #cfd9e6;
  border-radius: 8px;
  background: rgb(255 255 255 / 72%);
  box-shadow: 0 28px 70px rgb(25 48 85 / 16%);
  backdrop-filter: blur(18px);

  &__shield {
    display: inline-flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #08a899;
    background: #e8fffb;
    font-size: 22px;
  }

  &__mini {
    margin: 12px 0 0;
    color: #08a899;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 1px;
  }

  h2 {
    margin: 8px 0 12px;
    color: #061735;
    font-size: 40px;
    font-weight: 950;
  }

  &__desc {
    margin: 0 0 34px;
    color: #50617b;
    font-size: 16px;
    font-weight: 700;
  }

  :deep(.el-form-item) {
    margin-bottom: 22px;
  }

  :deep(.el-form-item__label) {
    color: #071833;
    font-weight: 900;
  }

  .el-button {
    width: 100%;
    height: 58px;
    margin-top: 14px;
    font-size: 20px;
    font-weight: 900;
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
  }

  .login-card {
    padding: 28px 22px;

    h2 {
      font-size: 28px;
    }
  }
}
</style>
