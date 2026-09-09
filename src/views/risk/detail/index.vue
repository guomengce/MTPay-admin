<template>
  <section class="admin-page risk-detail">
    <div class="risk-detail__toolbar">
      <div class="risk-detail__heading">
        <el-button plain :icon="Back" @click="router.back()">返回</el-button>
        <strong v-if="detail" class="risk-detail__case-no">風控案件 {{ detail.case_no }}</strong>
      </div>
      <div v-if="detail" class="risk-detail__actions">
        <el-button
          v-if="actions.can_request_risk_supplement && canOperate('riskCases.supplement')"
          type="warning"
          plain
          :icon="DocumentAdd"
          @click="open('supplement')"
          >要求補件</el-button
        >
        <el-button
          v-if="actions.can_clear_risk && canOperate('riskCases.review')"
          type="primary"
          plain
          :icon="CircleCheck"
          @click="open('clear')"
          >放行</el-button
        >
        <el-button
          v-if="actions.can_reject_risk && canOperate('riskCases.review')"
          type="danger"
          plain
          :icon="CircleClose"
          @click="open('reject')"
          >拒絕</el-button
        >
      </div>
    </div>

    <template v-if="detail">
      <div class="risk-detail__summary">
        <CaseOverviewPanel :detail="detail" />
        <RelatedOrderPanel :detail="detail" @view-withdrawal="viewWithdrawal" />
      </div>
      <div class="risk-detail__analysis">
        <RiskHitPanel :hits="detail.assessment.hits" />
        <RiskRecordPanel :records="detail.records ?? []" />
      </div>
    </template>
    <el-empty v-else-if="!loading" description="未找到風控案件" />

    <RiskCaseActionDialog
      v-model="dialog.visible"
      v-model:note="dialog.note"
      :mode="dialog.mode"
      :submitting="submitting"
      @submit="submit"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Back, CircleCheck, CircleClose, DocumentAdd } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import {
  getWithdrawalRiskCaseInfo,
  requestWithdrawalRiskSupplement,
  reviewWithdrawalRisk,
  type RiskCaseDetail,
} from '@/api/modules/withdrawalRisk';
import { usePageLoading } from '@/composables/usePageLoading';
import { usePermission } from '@/composables/usePermission';

import CaseOverviewPanel from './components/CaseOverviewPanel.vue';
import RelatedOrderPanel from './components/RelatedOrderPanel.vue';
import RiskCaseActionDialog, { type RiskActionMode } from './components/RiskCaseActionDialog.vue';
import RiskHitPanel from './components/RiskHitPanel.vue';
import RiskRecordPanel from './components/RiskRecordPanel.vue';

const route = useRoute();
const router = useRouter();
const { canOperate } = usePermission();
const loading = ref(false);
const submitting = ref(false);
const detail = ref<RiskCaseDetail | null>(null);
const dialog = reactive<{ visible: boolean; mode: RiskActionMode; note: string }>({
  visible: false,
  mode: 'supplement',
  note: '',
});
const actions = computed(
  () =>
    detail.value?.assessment.available_actions ?? {
      can_request_risk_supplement: false,
      can_clear_risk: false,
      can_reject_risk: false,
    },
);

usePageLoading(loading);

async function load() {
  const id = Number(route.params.id);
  if (!Number.isInteger(id) || id <= 0) return;
  loading.value = true;
  try {
    detail.value = await getWithdrawalRiskCaseInfo(id);
  } finally {
    loading.value = false;
  }
}

function open(mode: RiskActionMode) {
  dialog.mode = mode;
  dialog.note = '';
  dialog.visible = true;
}

function viewWithdrawal(id: number) {
  void router.push(`/withdrawal/detail/${id}`);
}

async function submit() {
  if (!detail.value) return;
  if (dialog.mode !== 'clear' && !dialog.note.trim()) {
    ElMessage.warning(dialog.mode === 'reject' ? '請輸入拒絕原因' : '請輸入補件要求');
    return;
  }
  submitting.value = true;
  try {
    if (dialog.mode === 'supplement') {
      await requestWithdrawalRiskSupplement({ id: detail.value.id, message: dialog.note.trim() });
    } else {
      await reviewWithdrawalRisk({
        id: detail.value.id,
        decision: dialog.mode,
        note: dialog.note.trim() || undefined,
      });
    }
    ElMessage.success('風控案件已更新');
    dialog.visible = false;
    await load();
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<style scoped lang="scss">
.risk-detail {
  gap: 20px;
}
.risk-detail__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.risk-detail__heading,
.risk-detail__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.risk-detail__case-no {
  color: var(--app-text-heading);
  font-size: 20px;
  line-height: 1.3;
}
.risk-detail__summary,
.risk-detail__analysis {
  display: grid;
  align-items: stretch;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
@include mobile {
  .risk-detail__analysis {
    grid-template-columns: 1fr;
  }
  .risk-detail__summary {
    grid-template-columns: 1fr;
  }
  .risk-detail__toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
