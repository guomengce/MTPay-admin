<template>
  <AdminPanel title="交易主体" subtitle="本次出金使用的已审核白名单及提交快照" :icon="CreditCard">
    <div class="party-flow">
      <PartyCard
        role="payer"
        role-label="付款人"
        :name="payer?.name"
        :whitelist-no="payer?.whitelist_no"
        :party-type="partyType(payer)"
        :bank-fields="payerBankFields"
        :subject-fields="payerSubjectFields"
      />
      <span class="party-flow__arrow"><el-icon><Right /></el-icon></span>
      <PartyCard
        role="payee"
        role-label="收款人"
        :name="payee?.name"
        :whitelist-no="payee?.whitelist_no"
        :party-type="partyType(payee)"
        :bank-fields="payeeBankFields"
        :subject-fields="payeeSubjectFields"
      />
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { CreditCard, Right } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { WithdrawalParty } from '@/api/modules/withdrawal';

import PartyCard from './PartyCard.vue';
import type { DetailField } from '../../composables/useWithdrawalDetailView';

defineProps<{
  payer: WithdrawalParty | undefined;
  payee: WithdrawalParty | undefined;
  payerBankFields: DetailField[];
  payerSubjectFields: DetailField[];
  payeeBankFields: DetailField[];
  payeeSubjectFields: DetailField[];
  partyType: (party: WithdrawalParty | undefined) => string;
}>();
</script>

<style scoped lang="scss">
.party-flow {
  display: grid;
  align-items: center;
  padding: 18px 20px 20px;
  grid-template-columns: minmax(0, 1fr) 46px minmax(0, 1fr);
  gap: 12px;

  &__arrow {
    display: inline-flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border: 1px solid #bfe0dd;
    border-radius: 50%;
    color: #0b9f98;
    background: #fff;
    font-size: 20px;
  }
}

@include mobile {
  .party-flow {
    padding: 4px 16px 16px;
    grid-template-columns: 1fr;

    &__arrow {
      margin: 0 auto;
      transform: rotate(90deg);
    }
  }
}
</style>
