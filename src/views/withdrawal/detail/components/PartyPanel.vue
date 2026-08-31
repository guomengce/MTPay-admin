<template>
  <div class="transaction-overview">
      <div class="transaction-amounts">
      <header class="transaction-section-title">
        <i aria-hidden="true"></i>
        <span>金額明細</span>
      </header>
      <div class="transaction-amounts__list">
        <div class="is-debit">
          <span><i></i>賬戶扣款</span>
          <strong>{{ formatMoney(detail.total_amount) }} <small>{{ detail.currency.code }}</small></strong>
        </div>
        <div class="is-fee">
          <span><i></i>手續費</span>
          <strong>{{ formatMoney(formatFixedFee(detail.fee_amount)) }} <small>{{ detail.currency.code }}</small></strong>
        </div>
        <div class="is-result">
          <span><i></i>實際出金</span>
          <strong>{{ formatMoney(detail.amount) }} <small>{{ detail.currency.code }}</small></strong>
        </div>
      </div>
      </div>
      <section class="transaction-parties">
        <div class="transaction-section-title">
          <i aria-hidden="true"></i>
          <span>交易主體</span>
        </div>
        <div class="party-flow">
          <PayerCompanyCard v-if="payer?.entity_type === 1" :fields="payerSubjectFields" />
          <PayerPersonCard v-else-if="payer?.entity_type === 2" :fields="payerSubjectFields" />
          <PayeeCompanyCard
            v-if="payee?.entity_type === 1"
            :fields="payeeSubjectFields"
            :bank-fields="payeeBankFields"
          />
          <PayeePersonCard
            v-else-if="payee?.entity_type === 2"
            :fields="payeeSubjectFields"
            :bank-fields="payeeBankFields"
          />
        </div>
      </section>
    </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import type { WithdrawalOrderDetail, WithdrawalParty } from '@/api/modules/withdrawal';
import { formatFixedFee } from '@/utils/decimal';

import PayeeCompanyCard from './PayeeCompanyCard.vue';
import PayeePersonCard from './PayeePersonCard.vue';
import PayerCompanyCard from './PayerCompanyCard.vue';
import PayerPersonCard from './PayerPersonCard.vue';
import type { DetailField } from '../../composables/useWithdrawalDetailView';

defineProps<{
  detail: WithdrawalOrderDetail;
  payer: WithdrawalParty | undefined;
  payee: WithdrawalParty | undefined;
  payerSubjectFields: DetailField[];
  payeeBankFields: DetailField[];
  payeeSubjectFields: DetailField[];
}>();
</script>

<style scoped lang="scss">
.transaction-overview {
  overflow: hidden;
  border: 1px solid #d8e3ec;
  border-radius: 15px;
  background: #fff;
  box-shadow:
    0 2px 5px rgb(20 46 78 / 4%),
    0 12px 30px rgb(20 46 78 / 8%);
}

.transaction-amounts {
  display: grid;
  padding: 15px;
  gap: 11px;

  > header {
    margin: -15px -15px 0;
    padding: 11px 14px;
    border-bottom: 1px solid #e2e9ef;
  }

  &__list {
    display: grid;
    gap: 2px;
  }

  &__list > div {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 45px;
    padding: 7px 10px;
    color: #53677c;

    > span { display: inline-flex; align-items: center; gap: 9px; font-size: 13px; }
    i { width: 7px; height: 7px; flex: none; border-radius: 50%; background: #4c89cf; }
    strong { color: #18314c; font-size: 20px; font-variant-numeric: tabular-nums; text-align: right; }
    small { font-size: 11px; }
  }

  .is-fee i { background: #d99a2b; }
  .is-result {
    min-height: 54px;
    border-radius: 9px;
    color: #087f79;
    background: linear-gradient(90deg, #effaf8 0%, #e8f7f4 100%);
    font-weight: 700;
  }
  .is-result i { background: #07978f; box-shadow: 0 0 0 4px rgb(7 151 143 / 10%); }
  .is-result strong { color: #078f87; font-size: 26px; }
}

.transaction-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #29445e;
  background: #f5f8fb;
  font-size: 13px;
  font-weight: 700;

  i {
    width: 3px;
    height: 18px;
    flex: none;
    border-radius: 999px;
    background: #0aa49a;
    box-shadow: 0 0 0 3px rgb(10 164 154 / 8%);
  }
}

.transaction-parties {
  border-top: 1px solid #e2e9ef;

  > .transaction-section-title {
    padding: 11px 14px;
  }
}

.party-flow {
  display: grid;
  align-items: start;
  padding: 18px 20px 20px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.party-flow :deep(.withdrawal-party-card) {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dce7ef;
  border-radius: 14px;
  background: #fbfcfe;

  > header {
    display: flex;
    min-height: 46px;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 14px;
    background: linear-gradient(90deg, #edf9f7, #f8fcfc);
  }

  &.is-payee {
    border-color: #dce6f3;
    background: #f8faff;

    > header { background: linear-gradient(90deg, #eef4fc, #fafcff); }
    .withdrawal-party-card__title i { background: #4b83d1; box-shadow: 0 0 0 4px rgb(75 131 209 / 10%); }
  }
}

.party-flow :deep(.withdrawal-party-card__title),
.party-flow :deep(.withdrawal-party-card__actions) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.party-flow :deep(.withdrawal-party-card__title) {
  i { width: 8px; height: 8px; flex: none; border-radius: 50%; background: #0aa49a; box-shadow: 0 0 0 4px rgb(10 164 154 / 10%); }
  h3 { margin: 0; color: #17324f; font-size: 14px; font-weight: 800; }
}

.party-flow :deep(.withdrawal-party-card__actions) {
  .status-badge { height: 25px; padding: 0 9px; font-size: 10px; }
  .el-button { margin-left: 0; color: #168f89; }
}

.party-flow :deep(.withdrawal-party-card__fields) {
  display: grid;
  margin: 0;
  padding: 10px 15px 14px;
  grid-template-columns: 1fr;

  > div { display: grid; min-width: 0; align-items: start; padding: 6px 0; grid-template-columns: 112px minmax(0, 1fr); gap: 8px; }
  dt { color: var(--app-text-label); font-size: 11px; }
  dd { margin: 0; color: var(--app-text-body); font-size: 13px; font-weight: 600; line-height: 1.55; overflow-wrap: anywhere; }
  dd.is-mono { font-family: ui-monospace, Consolas, monospace; }
}

.party-flow :deep(.withdrawal-party-card__bank) {
  margin: 0 15px 12px;
  padding-top: 10px;
  border-top: 1px solid #dfe8ef;

  h4 { margin: 0; color: #5e7186; font-size: 11px; font-weight: 700; }
  .withdrawal-party-card__fields { padding-right: 0; padding-left: 0; }
}

@include mobile {
  // .transaction-overview { margin: 14px 16px 16px; }
  .transaction-amounts { padding: 12px; }
  .transaction-amounts > header { margin: -12px -12px 0; }
  .transaction-amounts__list > div { min-height: 44px; padding: 8px 10px; }
  .transaction-amounts__list > div strong { font-size: 16px; }
  .transaction-amounts .is-result strong { font-size: 21px; }
  .party-flow {
    padding: 4px 16px 16px;
    grid-template-columns: 1fr;
  }
  .party-flow :deep(.withdrawal-party-card__fields > div) { grid-template-columns: 96px minmax(0, 1fr); }
}
</style>
