<template>
  <AdminHero
    :title="user?.company_name || '代理详情'"
    :description="user ? `${user.agent_code} · ${user.email}` : '正在读取代理资产概览'"
    :icon="UserFilled"
  >
    <template #extra>
      <div class="agent-overview-header__actions">
        <el-button :icon="Back" @click="emit('back')">返回列表</el-button>
        <el-button
          v-if="user?.status === 0"
          plain
          type="warning"
          :icon="Message"
          :loading="mailLoading === 'invitation'"
          @click="emit('send-invitation', user!)"
        >
          发送激活邮件
        </el-button>
        <el-button
          v-if="user?.status === 1 || user?.status === 2"
          plain
          type="primary"
          :icon="Key"
          :loading="mailLoading === 'password-reset'"
          @click="emit('send-password-reset', user!)"
        >
          发送密码重置邮件
        </el-button>
      </div>
    </template>
  </AdminHero>
</template>

<script setup lang="ts">
import { Back, Key, Message, UserFilled } from '@element-plus/icons-vue';
import AdminHero from '@/components/admin/AdminHero.vue';
import type { AgentAccount } from '@/api/modules/agent';

type AgentOverviewUser = Pick<
  AgentAccount,
  'agent_code' | 'company_name' | 'email' | 'status'
>;

defineProps<{
  user: AgentOverviewUser | null;
  mailLoading: 'invitation' | 'password-reset' | null;
}>();

const emit = defineEmits<{
  (event: 'back'): void;
  (event: 'send-invitation', user: AgentOverviewUser): void;
  (event: 'send-password-reset', user: AgentOverviewUser): void;
}>();
</script>

<style scoped lang="scss">
.agent-overview-header {
  &__actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  &__actions :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}

@include mobile {
  .agent-overview-header__actions,
  .agent-overview-header__actions :deep(.el-button) {
    width: 100%;
  }
}
</style>
