<template>
  <section v-loading="loading" class="admin-page whitelist-detail-page">
    <template v-if="detail">
      <DetailHero
        compact
        order="白名单编号"
        title="白名单审核"
        :description="`${detail.user.agent_code} · ${detail.user.company_name}`"
        :order-id="detail.whitelist_no"
        :status="heroStatus"
        :actions="heroActions"
        @back="goBack"
        @approve="openDialog('approve')"
        @reject="openDialog('reject')"
        @supplement="openDialog('supplement')"
      />

      <div class="whitelist-workspace">
        <main class="whitelist-workspace__main">
          <SubjectInfo
            :role="detail.role"
            :entity-type="detail.entity_type"
            :role-name="detail.role_name"
            :entity-type-name="detail.entity_type_name"
            :company-identity-fields="companyIdentityFields"
            :registration-fields="registrationFields"
            :payer-individual-identity-fields="payerIndividualIdentityFields"
            :payer-individual-residence-fields="payerIndividualResidenceFields"
            :payee-company-fields="payeeCompanyFields"
            :payee-company-location-fields="payeeCompanyLocationFields"
            :payee-individual-identity-fields="payeeIndividualIdentityFields"
            :payee-individual-residence-fields="payeeIndividualResidenceFields"
            :payee-bank-fields="payeeBankFields"
          />
        </main>

        <aside class="whitelist-workspace__aside">
          <Timeline
            :timeline-items="timelineItems"
            :file-rounds="fileRounds"
          />
        </aside>
      </div>

      <WhitelistAddDialog
        v-model="dialogVisible"
        :row="reviewRow"
        :mode="dialogMode"
        :submitting="submitting"
        @submit="handleSubmit"
      />
    </template>

    <el-empty v-else-if="!loading" description="未找到白名单记录">
      <el-button type="primary" @click="goBack">返回白名单列表</el-button>
    </el-empty>
  </section>
</template>

<script setup lang="ts">
/** 管理端白名单详情：按审核工作顺序组织信息。 */
import { computed, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import {
  CircleCheck,
  CircleClose,
  Document,
} from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';

import SubjectInfo from './components/SubjectInfo.vue';
import Timeline from './components/Timeline.vue';
import WhitelistAddDialog from '../components/WhitelistAddDialog.vue';
import type { WhitelistActionMode } from '../components/WhitelistAddDialog.vue';
import type { WhitelistRow } from '../composables/mapper';
import { getWhitelistStatusMeta } from '../composables/mapper';
import { useWhitelistDetail } from '../composables/useWhitelistDetail';
import { useWhitelistDetailView } from '../composables/useWhitelistDetailView';

const route = useRoute();
const router = useRouter();
const id = computed(() => Number(route.params.id));
const { loading, submitting, detail, loadDetail, submitReview, requestSupplement } =
  useWhitelistDetail();
const {
  companyIdentityFields,
  registrationFields,
  payerIndividualIdentityFields,
  payerIndividualResidenceFields,
  payeeCompanyFields,
  payeeCompanyLocationFields,
  payeeIndividualIdentityFields,
  payeeIndividualResidenceFields,
  payeeBankFields,
  fileRounds,
  timelineItems,
} = useWhitelistDetailView(detail);

const heroStatus = computed(() => {
  const meta = getWhitelistStatusMeta(detail.value?.status ?? 0);
  return { label: detail.value?.status_name || '未知状态', ...meta };
});

const heroActions = computed<HeroAction[]>(() => {
  if (detail.value?.status === 0) {
    return [
      { label: '通过', icon: CircleCheck, type: 'primary', emitName: 'approve' },
      { label: '要求补件', icon: Document, type: 'plain', emitName: 'supplement' },
      { label: '驳回', icon: CircleClose, type: 'danger', emitName: 'reject' },
    ];
  }
  if (detail.value?.status === 1) {
    return [{ label: '驳回', icon: CircleClose, type: 'danger', emitName: 'reject' }];
  }
  return [];
});

const reviewRow = computed<WhitelistRow | null>(() => {
  if (!detail.value) return null;
  const meta = getWhitelistStatusMeta(detail.value.status);
  return {
    businessId: detail.value.id, id: detail.value.whitelist_no,
    time: detail.value.submitted_at || '—', updatedAt: detail.value.updated_at || '—',
    agent: detail.value.user.company_name, agentCode: detail.value.user.agent_code,
    role: detail.value.role_name, entityType: detail.value.entity_type_name,
    type: `${detail.value.role_name} · ${detail.value.entity_type_name}`,
    subject: detail.value.subject_name, country: detail.value.country,
    fileCount: detail.value.file_count, status: detail.value.status_name,
    statusCode: detail.value.status, statusType: meta.type, statusEffect: meta.effect,
  };
});

const dialogVisible = ref(false);
const dialogMode = ref<WhitelistActionMode>('approve');

function goBack() { void router.push('/whitelist'); }
function openDialog(mode: WhitelistActionMode) { dialogMode.value = mode; dialogVisible.value = true; }

async function handleSubmit(payload: { row: WhitelistRow; mode: WhitelistActionMode; message?: string }) {
  try {
    if (payload.mode === 'supplement') {
      await requestSupplement({ id: payload.row.businessId, message: payload.message! });
      ElMessage.success('补件要求已发送');
    } else {
      await submitReview({ id: payload.row.businessId, decision: payload.mode, review_note: payload.mode === 'reject' ? payload.message : undefined });
      ElMessage.success(payload.mode === 'approve' ? '白名单审核已通过' : '白名单已驳回');
    }
    dialogVisible.value = false;
  } catch { /* 请求层已提示 */ }
}

async function reload() { if (Number.isInteger(id.value) && id.value > 0) await loadDetail(id.value); }
onMounted(reload);
watch(id, reload);
</script>

<style scoped lang="scss">
.whitelist-detail-page {
  gap: 20px;
}

.whitelist-workspace {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(0, 1.2fr) minmax(380px, 0.9fr);
  gap: 20px;

  &__main,
  &__aside { display: grid; min-width: 0; gap: 20px; }
}

@include narrow {
  .whitelist-workspace { grid-template-columns: 1fr; }
}

@include mobile {
  .whitelist-detail-page,
  .whitelist-workspace,
  .whitelist-workspace__main,
  .whitelist-workspace__aside {
    width: 100%;
    min-width: 0;
  }

  .whitelist-detail-page {
    gap: 14px;
    overflow: hidden;
  }

  .whitelist-workspace {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  .whitelist-workspace__aside { grid-template-columns: 1fr; }
}
</style>
