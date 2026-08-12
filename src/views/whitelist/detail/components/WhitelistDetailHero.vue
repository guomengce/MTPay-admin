<template>
  <section class="whitelist-detail-hero">
    <div class="whitelist-detail-hero__identity">
      <el-button
        class="whitelist-detail-hero__back"
        plain
        :icon="ArrowLeft"
        @click="$emit('back')"
      />

      <div class="whitelist-detail-hero__title">
        <h1>{{ detail.title }}</h1>
        <p>{{ detail.description }}</p>
      </div>
    </div>

    <div class="whitelist-detail-hero__meta">
      <span class="whitelist-detail-hero__order">
        白名单审核 / <strong>{{ detail.id }}</strong>
      </span>

      <div class="whitelist-detail-hero__controls">
        <StatusBadge
          class="whitelist-detail-hero__status"
          :label="detail.status"
          :type="detail.statusType"
          :effect="detail.statusEffect"
        />

        <div class="whitelist-detail-hero__actions">
          <el-button type="primary" :icon="CircleCheck" @click="$emit('approve')">通过</el-button>
          <el-button plain type="danger" :icon="CircleClose" @click="$emit('reject')">
            拒绝
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft, CircleCheck, CircleClose } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { WhitelistDetail } from '../types';

defineProps<{ detail: WhitelistDetail }>();

defineEmits<{
  (e: 'back'): void;
  (e: 'approve'): void;
  (e: 'reject'): void;
}>();
</script>

<style scoped lang="scss">
.whitelist-detail-hero {
  position: relative;
  min-height: 180px;
  overflow: hidden;
  padding: 24px 36px 26px;
  border: 1px solid #dce7f5;
  border-radius: 0 0 18px 18px;
  background:
    repeating-radial-gradient(
      ellipse at 56% -10%,
      transparent 0 12px,
      rgb(18 109 240 / 8%) 13px,
      transparent 14px
    ),
    linear-gradient(135deg, #ffffff 0%, #f7fbff 58%, #eef7ff 100%);
  box-shadow: 0 12px 30px rgb(15 23 42 / 8%);

  &__identity,
  &__meta {
    position: relative;
    z-index: 1;
  }

  &__identity {
    display: flex;
    align-items: stretch;
    gap: 16px;
  }

  &__back {
    width: 64px;
    height: 64px;
    min-width: 64px;
    padding: 0;
    border-radius: 14px;
  }

  &__title {
    display: grid;
    align-content: center;
    min-width: 0;

    h1 {
      min-width: 0;
      margin: 0 0 8px;
      overflow-wrap: anywhere;
      color: #061936;
      font-size: 30px;
      font-weight: 950;
      line-height: 1.15;
      letter-spacing: 0.02em;
    }

    p {
      margin: 0;
      color: #66758b;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.5;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-top: 22px;
    padding-left: 80px;
  }

  &__order {
    display: inline-flex;
    min-height: 52px;
    align-items: center;
    padding: 0 18px;
    border: 1px solid #cfe1f5;
    border-radius: 14px;
    color: #66758b;
    background: rgb(255 255 255 / 72%);
    box-shadow: 0 8px 18px rgb(18 109 240 / 7%);
    font-size: 16px;
    font-weight: 850;

    strong {
      min-width: 0;
      overflow-wrap: anywhere;
      color: #334155;
      font-weight: 950;
    }
  }

  &__controls {
    display: grid;
    justify-items: end;
    gap: 14px;
    min-width: min(390px, 100%);
  }

  &__status {
    height: 34px;
    padding: 0 16px;
    font-size: 15px;
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    gap: 14px;
    width: min(390px, 100%);

    .el-button {
      width: 100%;
      min-width: 0;
      margin-left: 0;
    }
  }

  @include narrow {
    padding: 22px 28px 24px;

    &__identity {
      gap: 14px;
    }

    &__back {
      width: 56px;
      height: 56px;
      min-width: 56px;
      border-radius: 12px;
    }

    &__title {
      h1 {
        font-size: 26px;
      }

      p {
        font-size: 13px;
      }
    }

    &__meta {
      gap: 16px;
      margin-top: 18px;
      padding-left: 70px;
    }

    &__order {
      min-height: 46px;
      padding: 0 14px;
      font-size: 14px;
    }

    &__controls {
      min-width: min(320px, 100%);
      gap: 10px;
    }

    &__status {
      height: 30px;
      font-size: 13px;
    }

    &__actions {
      width: min(320px, 100%);
      gap: 10px;

      .el-button {
        min-width: 120px;
      }
    }
  }

  @include mobile {
    min-height: auto;
    padding: 20px 18px;
    border-radius: 16px;

    &__identity {
      gap: 12px;
    }

    &__back {
      width: 48px;
      height: 48px;
      min-width: 48px;
      border-radius: 12px;
    }

    &__title {
      h1 {
        font-size: 22px;
      }

      p {
        font-size: 13px;
        line-height: 1.45;
      }
    }

    &__meta {
      align-items: stretch;
      flex-direction: column;
      gap: 14px;
      margin-top: 16px;
      padding-left: 0;
    }

    &__order {
      width: 100%;
      min-height: auto;
      padding: 10px 14px;
      font-size: 13px;
    }

    &__controls {
      min-width: 0;
      gap: 10px;
      justify-items: stretch;
    }

    &__status {
      height: 28px;
      font-size: 12px;
    }

    &__actions {
      grid-template-columns: 1fr;
      width: 100%;
      gap: 10px;
    }
  }
}
</style>
