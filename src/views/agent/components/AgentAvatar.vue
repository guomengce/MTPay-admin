<template>
  <span class="agent-avatar" :class="`is-${size}`" aria-hidden="true">
    {{ initial }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ name?: string; size?: 'default' | 'large' }>(), {
  name: '',
  size: 'default',
});

const initial = computed(() => props.name.trim().charAt(0).toUpperCase() || '—');
</script>

<style scoped lang="scss">
.agent-avatar {
  display: inline-flex;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(135deg, #17c4ad, #1f73f2);
  box-shadow: 0 8px 18px rgb(31 115 242 / 15%);
  font-size: 16px;
  font-weight: 700;

  &.is-large {
    width: 72px;
    height: 72px;
    flex-basis: 72px;
    border-radius: 17px;
    font-size: 30px;
  }
}

@include mobile {
  .agent-avatar.is-large {
    width: 58px;
    height: 58px;
    flex-basis: 58px;
    border-radius: 14px;
    font-size: 24px;
  }
}
</style>
