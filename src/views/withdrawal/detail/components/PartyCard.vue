<template>
  <article :class="['party-card', `is-${role}`]">
    <header><span>{{ roleLabel }} · {{ partyType }}</span></header>
    <h3>{{ name || '—' }}</h3>
    <p>{{ whitelistNo || '—' }}</p>
    <section v-if="bankFields.length" class="party-sub">
      <h4>银行信息</h4>
      <dl class="detail-fields">
        <div
          v-for="item in bankFields"
          :key="item.key"
          :class="{ 'is-wide': item.wide }"
        >
          <dt>{{ item.label }}</dt>
          <dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd>
        </div>
      </dl>
    </section>
    <section v-if="subjectFields.length" class="party-sub">
      <h4>主体信息</h4>
      <dl class="detail-fields">
        <div
          v-for="item in subjectFields"
          :key="item.key"
          :class="{ 'is-wide': item.wide }"
        >
          <dt>{{ item.label }}</dt>
          <dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd>
        </div>
      </dl>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { DetailField } from '../../composables/useWithdrawalDetailView';

defineProps<{
  /** 角色标识：payer / payee，决定配色。 */
  role: 'payer' | 'payee';
  /** 角色标题：付款人 / 收款人。 */
  roleLabel: string;
  /** 主体名称。 */
  name: string | null | undefined;
  /** 白名单编号。 */
  whitelistNo: string | null | undefined;
  /** 主体类型：公司 / 个人。 */
  partyType: string;
  /** 银行信息字段。 */
  bankFields: DetailField[];
  /** 主体信息字段。 */
  subjectFields: DetailField[];
}>();
</script>

<style scoped lang="scss">
.party-card {
  min-width: 0;
  overflow: hidden;
  padding: 15px;
  border: 1px solid #dde7ef;
  border-radius: 14px;
  background: #fbfcfe;

  header {
    display: flex;
    align-items: center;
    gap: 10px;

    span { display: inline-flex; width: fit-content; height: 25px; align-items: center; padding: 0 9px; border-radius: 7px; color: #087f79; background: #e6f7f4; font-size: 10px; font-weight: 700; }
  }

  h3 {
    margin: 12px 0 0;
    color: var(--app-text-heading);
    font-size: 17px;
    overflow-wrap: anywhere;
  }

  > p {
    margin: 5px 0 0;
    color: #138f91;
    font-family: ui-monospace, Consolas, monospace;
    font-size: 12px;
    overflow-wrap: anywhere;
  }

  &.is-payee {
    border-color: #dce6f3;
    background: #f8faff;

    header span { color: #3469a5; background: #edf4fb; }
    h3 { color: #17324f; }
  }
}

.party-sub {
  margin-top: 16px;

  > h4 {
    margin: 0;
    padding: 7px 10px;
    border-radius: 8px;
    color: #5e7186;
    background: #eef3f8;
    font-size: 12px;
    font-weight: 600;
  }

  .detail-fields { margin-top: 2px; }
}

.detail-fields {
  display: grid;
  margin: 14px 0 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;

  > div { min-width: 0; padding: 11px 0; border-bottom: 1px dashed #dfe7ef; }
  > div.is-wide { grid-column: 1 / -1; }
  dt { color: var(--app-text-label); font-size: 11px; }
  dd {
    margin: 5px 0 0;
    color: var(--app-text-body);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
  dd.is-mono { font-family: ui-monospace, Consolas, monospace; }
}

@include mobile {
  .detail-fields { grid-template-columns: 1fr; }
  .detail-fields > div.is-wide { grid-column: auto; }
}
</style>
