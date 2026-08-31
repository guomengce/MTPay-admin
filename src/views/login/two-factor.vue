<template>
  <main class="two-factor-page">
    <LoginBrandPanel />
    <section class="two-factor-card-wrap">
      <form class="two-factor-card" @submit.prevent="submit">
        <span class="two-factor-card__icon"><i class="ri-shield-keyhole-line" /></span>
        <div class="two-factor-card__heading"><h1>雙重認證</h1><p>請輸入認證器應用程式所顯示的 6 位驗證碼</p></div>
        <label for="admin-two-factor-code">驗證碼</label>
        <el-input id="admin-two-factor-code" v-model="code" :disabled="submitting || expired" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" />
        <p v-if="invalid" role="alert">請輸入 6 位數字驗證碼</p>
        <el-alert v-if="error" :title="error" type="error" :closable="false" />
        <el-button type="primary" native-type="submit" :loading="submitting" :disabled="submitting || expired">驗證並登入</el-button>
        <div class="two-factor-card__actions"><button type="button" @click="back"><i class="ri-arrow-left-line" /> 返回登入</button><button type="button" @click="help">無法使用認證器？</button></div>
        <p v-if="expired" class="two-factor-card__notice" role="status">驗證已過期，請返回重新登入</p>
      </form>
    </section>
  </main>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import LoginBrandPanel from './components/LoginBrandPanel.vue';
import { useTwoFactorLogin } from '@/composables/useTwoFactorLogin';
const { code, submitting, invalid, error, expired, submit, back } = useTwoFactorLogin();
function help() { ElMessage.info('請聯絡系統管理員重設雙重認證'); }
</script>
<style scoped lang="scss">
.two-factor-page{position:relative;display:grid;grid-template-columns:1fr 1fr;min-height:100vh;overflow:hidden;background:#f7fbff}.two-factor-card-wrap{position:relative;z-index:1;display:grid;place-items:center;padding:40px}.two-factor-card{display:grid;width:min(520px,100%);gap:18px;padding:46px 50px 38px;border:1px solid #e1e9f2;border-radius:28px;background:rgb(255 255 255 / 98%);box-shadow:0 28px 65px rgb(17 47 82 / 14%)}.two-factor-card__icon{display:grid;width:62px;height:62px;margin:auto;place-items:center;border-radius:18px;color:#0ba89b;background:#eafffb;font-size:31px}.two-factor-card__heading{text-align:center}.two-factor-card h1{margin:0;color:#061b3c;font-size:32px}.two-factor-card__heading p{margin:8px 0 10px;color:#71839a;font-size:14px}.two-factor-card label{color:#061b3c;font-weight:600}:deep(.el-input__wrapper){padding:7px 18px;border-radius:14px;background:#f7faff}:deep(.el-input__inner){height:48px;text-align:center;font-size:24px;font-weight:700;letter-spacing:.48em}.two-factor-card>.el-button{height:56px;margin-top:4px;border:0;border-radius:14px;background:linear-gradient(135deg,#12b9aa,#079a90);font-size:17px;font-weight:700}.two-factor-card__actions{display:flex;justify-content:space-between}.two-factor-card__actions button{padding:0;border:0;color:#078f89;background:none;cursor:pointer;font:inherit;font-size:13px}.two-factor-card__notice{display:flex;gap:7px;margin:6px 0 0;padding-top:18px;border-top:1px solid #e8eef4;color:#7d8da2;font-size:12px;line-height:1.55}@include mobile{.two-factor-page{display:block;min-height:100svh;overflow-y:auto;padding-bottom:72px}.two-factor-card-wrap{width:calc(100% - 32px);margin:-70px auto 0;padding:0}.two-factor-card{padding:34px 26px 30px;border-radius:22px}.two-factor-card h1{font-size:26px}}
</style>
