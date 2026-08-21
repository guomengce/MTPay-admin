<template>
  <AdminPanel
    class="subject-info"
    title="主体信息"
    subtitle="根据白名单角色与主体类型展示对应资料"
    :icon="OfficeBuilding"
  >
    <div class="subject-info__tags subject-meta-tags">
      <span class="subject-meta-tags__chip">
        <el-icon><Postcard /></el-icon>
        <span>{{ roleName }}</span>
      </span>
      <span class="subject-meta-tags__chip subject-meta-tags__chip--entity">
        <el-icon><component :is="entityType === 1 ? OfficeBuilding : User" /></el-icon>
        <span>{{ entityTypeName }}（{{ entityType === 1 ? 'B' : 'C' }}）</span>
      </span>
    </div>

    <div class="subject-info__sections">
      <!-- 聚合层只判断主体类型，各资料组件在不同组合间复用。 -->
      <template v-if="entityType === 1">
        <CompanyInfo :fields="role === 1 ? companyIdentityFields : payeeCompanyFields" />
        <CompanyAddress :fields="role === 1 ? registrationFields : payeeCompanyLocationFields" />
      </template>

      <template v-else-if="entityType === 2">
        <PersonalInfo
          :fields="role === 1 ? payerIndividualIdentityFields : payeeIndividualIdentityFields"
        />
        <ResidenceInfo
          :fields="role === 1 ? payerIndividualResidenceFields : payeeIndividualResidenceFields"
        />
      </template>

      <BankInfo v-if="role === 2" :fields="payeeBankFields" />
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Lock, OfficeBuilding, Postcard, User } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';

import BankInfo from './subject/BankInfo.vue';
import CompanyAddress from './subject/CompanyAddress.vue';
import CompanyInfo from './subject/CompanyInfo.vue';
import PersonalInfo from './subject/PersonalInfo.vue';
import ResidenceInfo from './subject/ResidenceInfo.vue';
import type { WhitelistDetailField } from '../../composables/useWhitelistDetailView';

defineProps<{
  role: 1 | 2;
  entityType: 1 | 2;
  roleName: string;
  entityTypeName: string;
  /* 付款人 / 公司 */
  companyIdentityFields: WhitelistDetailField[];
  registrationFields: WhitelistDetailField[];
  /* 付款人 / 个人 */
  payerIndividualIdentityFields: WhitelistDetailField[];
  payerIndividualResidenceFields: WhitelistDetailField[];
  /* 收款人 / 公司 */
  payeeCompanyFields: WhitelistDetailField[];
  payeeCompanyLocationFields: WhitelistDetailField[];
  /* 收款人 / 个人 */
  payeeIndividualIdentityFields: WhitelistDetailField[];
  payeeIndividualResidenceFields: WhitelistDetailField[];
  /* 收款账户信息（收款人共用） */
  payeeBankFields: WhitelistDetailField[];
}>();
</script>

<style scoped lang="scss">
.subject-info {
  :deep(.admin-panel__header) {
    padding: 24px 26px 18px;
    border-bottom: 0;
  }

  :deep(.admin-panel__icon) {
    width: 52px;
    height: 52px;
    flex-basis: 52px;
    border-radius: 50%;
    color: #087f79;
    background: #e8f7f5;
  }

  &__tags {
    padding: 0 26px 20px 94px;
    border-bottom: 1px solid #e5ebf1;
  }

  &__sections {
    display: grid;
    padding: 18px 26px 26px;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}

.readonly-hint {
  display: grid;
  justify-items: end;
  gap: 2px;
  color: var(--app-text-label);

  p {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    color: var(--app-text-body);
    font-size: 13px;
    font-weight: 600;
  }

  .el-icon { color: #126df0; font-size: 14px; }
  small { color: var(--app-text-label); font-size: 11px; }
}

.subject-meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  &__chip {
    display: inline-flex;
    height: 30px;
    align-items: center;
    gap: 6px;
    padding: 0 13px;
    border-radius: 9px;
    color: #087f79;
    background: #e6f7f4;
    font-size: 13px;
    font-weight: 600;

    &--entity { color: #235f9d; background: #edf4fb; }
  }
}

.subject-info :deep(.subject-section) {
  min-width: 0;
  padding: 18px;
  border-radius: 14px;
  background: #f5f8fb;
}

.subject-info :deep(.subject-section__header) {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;

  h3 { margin: 0; color: var(--app-text-heading); font-size: 15px; font-weight: 650; }
  p { margin: 3px 0 0; color: var(--app-text-label); font-size: 12px; }
}

.subject-info :deep(.subject-section__icon) {
  display: inline-flex;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #087f79;
  background: #e8f7f5;
  font-size: 17px;
}

.subject-info :deep(.subject-section__grid) {
  display: grid;
  margin: 0;
  padding: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  > div { min-width: 0; min-height: 70px; padding: 12px 14px; border-radius: 10px; background: #fff; }
  > div.is-missing { background: #fffaf2; }
  .is-wide { grid-column: 1 / -1; }
  dt { color: var(--app-text-label); font-size: 12px; line-height: 1.4; }
  dd { margin: 7px 0 0; color: var(--app-text-body); font-size: 14px; font-weight: 600; line-height: 1.55; overflow-wrap: anywhere; }
  dd.is-mono { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 13px; }
  .is-missing dd { color: #b26a12; font-family: inherit; font-weight: 500; }
}

@include mobile {
  .subject-info {
    :deep(.admin-panel__header) { padding: 18px 16px 12px; }
    &__tags { padding: 0 16px 16px; }
    &__sections { padding: 14px 16px 16px; }

    :deep(.subject-section) { padding: 14px; }
    :deep(.subject-section__grid) { grid-template-columns: 1fr; }
    :deep(.subject-section__grid .is-wide) { grid-column: auto; }
  }
}
</style>
