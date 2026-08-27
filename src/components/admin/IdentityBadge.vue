<template>
  <StatusBadge :label="getIdentityBadgeLabel(role, entityType)" :type="getIdentityBadgeType(role, entityType)" />
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue';
import {
  getIdentityBadgeLabel,
  getIdentityBadgeType,
  type IdentityEntityType,
  type IdentityRole,
} from '@/utils/identityBadge';

defineProps<{ role: IdentityRole; entityType: IdentityEntityType }>();
</script>
