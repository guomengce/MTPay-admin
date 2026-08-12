<template>
  <AdminPanel class="whitelist-review-remark">
    <h2>审核备注</h2>

    <div class="whitelist-review-remark__box">
      <span class="whitelist-review-remark__icon">
        <ChatDotRound />
      </span>
      <strong>{{ detail.reviewRemark }}</strong>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { ChatDotRound } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { WhitelistDetail } from '../types';

defineProps<{ detail: WhitelistDetail }>();
</script>

<style scoped lang="scss">
.whitelist-review-remark {
  padding: 24px 28px;

  h2 {
    margin: 0 0 14px;
    color: #061936;
    font-size: 22px;
    font-weight: 950;
  }

  &__box {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border: 1px solid #ffd79d;
    border-radius: 12px;
    background: #fff4df;
    color: #9a5d09;
  }

  &__icon {
    display: inline-flex;
    width: 36px;
    height: 36px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #fff;
    background: #f5a524;
    font-size: 18px;
  }

  strong {
    color: #061936;
    font-size: 16px;
    font-weight: 850;
  }

  @include narrow {
    padding: 22px 24px;

    h2 {
      font-size: 20px;
    }

    &__box {
      gap: 12px;
      padding: 14px 16px;
    }
  }

  @include mobile {
    padding: 20px;

    &__box {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding: 14px 16px;

      strong {
        font-size: 14px;
        line-height: 1.5;
      }
    }

    &__icon {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
  }
}
</style>
