<template>
  <section class="login-card-wrap">
    <form class="login-card" @submit.prevent="handleSubmit">
      <div class="login-card__heading">
        <span class="login-card__title-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6l-7-3Z" />
            <rect x="9" y="10.5" width="6" height="5" rx="1" />
            <path d="M10.5 10.5V9.3a1.5 1.5 0 0 1 3 0v1.2" />
          </svg>
        </span>
        <div>
          <h2>登录管理后台</h2>
          <p>登录以继续管理代理与资金流程</p>
        </div>
      </div>

      <label for="login-email">管理员 Email</label>
      <el-input id="login-email" v-model="form.email" size="large" :prefix-icon="User" />

      <label for="login-password">密码</label>
      <el-input
        id="login-password"
        v-model="form.password"
        size="large"
        type="password"
        show-password
        :prefix-icon="Lock"
      />

      <el-button native-type="submit" type="primary" size="large" :loading="submitting">
        登入
      </el-button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Lock, User } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { fetchLogin } from '@/api/modules/auth';
import { useAuthStore } from '@/stores/modules/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const form = reactive({ email: '', password: '' });
const submitting = ref(false);

async function handleSubmit() {
  if (!form.email.trim() || !form.password) {
    ElMessage.warning('请输入管理员 Email 和密码');
    return;
  }
  submitting.value = true;
  try {
    const result = await fetchLogin({ email: form.email.trim(), password: form.password });
    authStore.login({
      token: result.token,
      userInfo: {
        id: String(result.id),
        name: String(result.name || result.username || result.email || 'MTPay 管理员'),
        email: String(result.email || form.email.trim()),
        role: 'admin',
      },
    });
    await router.replace(String(route.query.redirect || '/dashboard'));
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped lang="scss">
.login-card-wrap { width: min(560px, calc(100% - 80px)); }

.login-card {
  display: grid;
  gap: 18px;
  padding: 50px;
  border: 1px solid #e1e9f2;
  border-radius: 28px;
  background: rgb(255 255 255 / 98%);
  box-shadow: 0 28px 65px rgb(17 47 82 / 14%);

  &__heading {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 16px;

    p { margin: 5px 0 0; color: #71839a; font-size: 13px; font-weight: 600; }
  }

  &__title-icon {
    display: grid;
    width: 48px;
    height: 48px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid rgb(15 174 161 / 18%);
    border-radius: 14px;
    background: linear-gradient(145deg, #eafffb, #f4fbff);

    svg { width: 27px; fill: none; stroke: #0ba89b; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.7; }
  }

  h2 {
    margin: 0;
    color: #061b3c;
    font-size: 38px;
    font-weight: 700;
  }

  label {
    color: #061b3c;
    font-size: 17px;
    font-weight: 600;
  }

  :deep(.el-input__wrapper) {
    padding: 8px 18px;
    border-radius: 14px;
    background: #f7faff;
    box-shadow: 0 0 0 1px #dbe5ef inset;
  }

  :deep(.el-input__inner) { height: 48px; color: #081b3b; font-size: 18px; }
  :deep(.el-input__prefix) { margin-right: 14px; color: #a8b5c7; font-size: 21px; }

  .el-button {
    height: 62px;
    margin-top: 18px;
    border: 0;
    border-radius: 14px;
    background: linear-gradient(135deg, #12b9aa, #079a90);
    box-shadow: 0 14px 26px rgb(10 158 147 / 24%);
    font-size: 21px;
    font-weight: 700;
    letter-spacing: 3px;
  }

  @include mobile {
    gap: 18px;
    padding: 38px 30px 34px;
    border-radius: 22px;

    &__heading { gap: 12px; margin-bottom: 10px; }
    &__title-icon { width: 42px; height: 42px; border-radius: 12px; }
    &__heading p { display: none; }
    h2 { font-size: 28px; }
    label { font-size: 15px; }
    :deep(.el-input__wrapper) { padding: 5px 14px; border-radius: 12px; }
    :deep(.el-input__inner) { height: 44px; font-size: 16px; }
    .el-button { height: 54px; margin-top: 12px; font-size: 18px; }
  }
}

@include mobile { .login-card-wrap { width: auto; } }
</style>
