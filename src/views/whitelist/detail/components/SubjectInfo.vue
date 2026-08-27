<template>
  <AdminPanel
    class="subject-info"
    title="主体信息"
    :icon="OfficeBuilding"
  >
    <template #extra>
      <IdentityBadge :role="role" :entity-type="entityType" />
    </template>

    <div class="subject-info__sections">
      <!-- 聚合层只判断主体类型，各资料组件在不同组合间复用。 -->
      <template v-if="entityType === 1">
        <CompanyInfo
          :fields="role === 1
            ? [...companyIdentityFields, ...registrationFields]
            : [...payeeCompanyFields, ...payeeCompanyLocationFields]"
        />
      </template>

      <template v-else-if="entityType === 2">
        <PersonalInfo
          :fields="role === 1
            ? [...payerIndividualIdentityFields, ...payerIndividualResidenceFields]
            : [...payeeIndividualIdentityFields, ...payeeIndividualResidenceFields]"
        />
      </template>

      <BankInfo v-if="role === 2" :fields="payeeBankFields" />
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { OfficeBuilding } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';

import BankInfo from './subject/BankInfo.vue';
import CompanyInfo from './subject/CompanyInfo.vue';
import PersonalInfo from './subject/PersonalInfo.vue';
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
    padding: 16px 20px;
  }

  :deep(.admin-panel__icon) {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
    border-radius: 11px;
    color: #087f79;
    background: #e8f7f5;
    font-size: 21px;
  }

  &__sections {
    display: grid;
    padding: 18px 26px 26px;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
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
    :deep(.admin-panel__header) {
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 14px 16px;
    }
    :deep(.admin-panel__title) { flex: 1 1 auto; }
    &__sections { padding: 14px 16px 16px; }

    :deep(.subject-section) { padding: 14px; }
    :deep(.subject-section__grid) { grid-template-columns: 1fr; }
    :deep(.subject-section__grid .is-wide) { grid-column: auto; }
  }
}
</style>
