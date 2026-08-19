<template>
  <section v-loading="loading" class="admin-page whitelist-detail-page">
    <template v-if="detail">
      <DetailHero
        compact
        order="白名单编号"
        title="白名单审核"
        :description="`${detail.role_name} · ${detail.entity_type_name}`"
        :order-id="detail.whitelist_no"
        :status="heroStatus"
        :actions="heroActions"
        @back="goBack"
        @approve="openDialog('approve')"
        @reject="openDialog('reject')"
        @supplement="openDialog('supplement')"
      />

      <!-- 全局审核上下文：代理、主体和提交时间只在这里出现一次。 -->
      <AdminPanel class="whitelist-summary">
        <div class="summary-grid">
          <article>
            <span class="is-agent"><el-icon><User /></el-icon></span>
            <div>
              <small>所属代理</small>
              <strong>{{ detail.user.company_name }}</strong>
              <p>{{ detail.user.agent_code }} · {{ detail.user.email }}</p>
            </div>
          </article>
          <article>
            <span class="is-subject"><el-icon><Postcard /></el-icon></span>
            <div>
              <small>审核主体</small>
              <strong>{{ detail.subject_name }}</strong>
              <p>{{ detail.role_name }} · {{ detail.entity_type_name }}</p>
            </div>
          </article>
          <article>
            <span class="is-location"><el-icon><Location /></el-icon></span>
            <div>
              <small>主体国家／地区</small>
              <strong>{{ detail.country || '—' }}</strong>
            </div>
          </article>
          <article>
            <span class="is-time"><el-icon><Calendar /></el-icon></span>
            <div>
              <small>提交时间</small>
              <strong>{{ detail.submitted_at || '—' }}</strong>
              <p v-if="detail.updated_at">更新于 {{ detail.updated_at }}</p>
            </div>
          </article>
        </div>
      </AdminPanel>

      <div class="whitelist-workspace">
        <main class="whitelist-workspace__main">
          <!-- 主体资料固定按身份登记、地址两组排列，不再按接口对象顺序乱排。 -->
          <AdminPanel title="主体资料" subtitle="核对身份、登记信息和所在地" :icon="Document">
            <div class="subject-sections">
              <section v-if="identityFields.length" class="field-section">
                <header>
                  <span><el-icon><Postcard /></el-icon></span>
                  <div><h3>身份与登记</h3><p>主体证件及登记属性</p></div>
                </header>
                <dl class="field-grid">
                  <div v-for="item in identityFields" :key="item.key" :class="{ 'is-wide': item.wide }">
                    <dt>{{ item.label }}</dt>
                    <dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd>
                  </div>
                </dl>
              </section>

              <section v-if="locationFields.length" class="field-section">
                <header>
                  <span><el-icon><MapLocation /></el-icon></span>
                  <div><h3>地址资料</h3><p>注册、经营或居住所在地</p></div>
                </header>
                <dl class="field-grid">
                  <div v-for="item in locationFields" :key="item.key" :class="{ 'is-wide': item.wide }">
                    <dt>{{ item.label }}</dt>
                    <dd>{{ item.value }}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </AdminPanel>

          <!-- 只有收款人接口返回银行数据时才显示该区块。 -->
          <AdminPanel
            v-if="bankFields.length"
            title="银行与汇款资料"
            subtitle="核对收款账户、SWIFT 和汇款目的"
            :icon="CreditCard"
          >
            <dl class="field-grid panel-field-grid">
              <div v-for="item in bankFields" :key="item.key" :class="{ 'is-wide': item.wide }">
                <dt>{{ item.label }}</dt>
                <dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd>
              </div>
            </dl>
          </AdminPanel>

        </main>

        <aside class="whitelist-workspace__aside">
          <!-- 文件属于具体的提交/补件动作，直接挂载在对应时间线节点下。 -->
          <AdminPanel v-if="timelineItems.length" class="timeline-panel">
            <AdminTimeline title="处理时间线" :items="timelineItems">
              <template #item-extra="{ item }">
                <div v-if="getFileRound(item.key)" class="timeline-files">
                  <p class="timeline-files__count">
                    本次关联 {{ getFileRound(item.key)?.files.length }} 个文件
                  </p>
                  <div class="file-list">
                    <article v-for="file in getFileRound(item.key)?.files" :key="file.file_id">
                      <span class="file-list__type">{{ file.extension?.toUpperCase() || 'FILE' }}</span>
                      <div class="file-list__info">
                        <strong :title="file.original_name">{{ file.original_name }}</strong>
                        <p>{{ formatFileSize(file.size) }} · {{ file.uploaded_at || '—' }}</p>
                      </div>
                      <div class="file-list__actions">
                        <el-button
                          size="small"
                          type="primary"
                          plain
                          :icon="View"
                          :loading="isFileLoading(file.file_id, 'preview')"
                          @click="previewFile(file.file_id)"
                        >预览</el-button>
                        <el-button
                          size="small"
                          plain
                          :icon="Download"
                          :loading="isFileLoading(file.file_id, 'download')"
                          @click="downloadFile(file.file_id, file.original_name)"
                        >下载</el-button>
                      </div>
                    </article>
                  </div>
                </div>
              </template>
            </AdminTimeline>
          </AdminPanel>
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
  Calendar,
  CircleCheck,
  CircleClose,
  CreditCard,
  Document,
  Download,
  Location,
  MapLocation,
  Postcard,
  User,
  View,
} from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';

import WhitelistAddDialog from '../components/WhitelistAddDialog.vue';
import type { WhitelistActionMode } from '../components/WhitelistAddDialog.vue';
import type { WhitelistRow } from '../composables/mapper';
import { getWhitelistStatusMeta } from '../composables/mapper';
import { useWhitelistAttachments } from '../composables/useWhitelistAttachments';
import { useWhitelistDetail } from '../composables/useWhitelistDetail';
import {
  formatFileSize,
  useWhitelistDetailView,
} from '../composables/useWhitelistDetailView';

const route = useRoute();
const router = useRouter();
const id = computed(() => Number(route.params.id));
const { loading, submitting, detail, loadDetail, submitReview, requestSupplement } =
  useWhitelistDetail();
const { isLoading: isFileLoading, preview: previewFile, download: downloadFile } =
  useWhitelistAttachments();
const { identityFields, locationFields, bankFields, fileRounds, timelineItems } =
  useWhitelistDetailView(detail);

/** 时间线节点与后端 records 使用同一个 id，文件因此不会脱离所属操作轮次。 */
function getFileRound(key: string) {
  return fileRounds.value.find((round) => String(round.key) === key);
}

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

.whitelist-summary {
  padding: 0 24px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  article {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 12px;
    padding: 20px 16px;
    border-right: 1px solid #e4ebf2;

    &:last-child { border-right: 0; }
    > div { min-width: 0; }
    > span {
      display: inline-flex;
      width: 40px;
      height: 40px;
      flex: none;
      align-items: center;
      justify-content: center;
      border-radius: 11px;
      color: #126df0;
      background: #edf5ff;
      font-size: 19px;
    }
    > span.is-agent { color: #7c4dff; background: #f1edff; }
    > span.is-subject { color: #0b9f98; background: #e7f8f5; }
    > span.is-location { color: #dc8800; background: #fff5df; }
  }

  small,
  p { color: var(--app-text-label); font-size: 12px; font-weight: 400; }
  strong {
    display: block;
    margin-top: 4px;
    overflow: hidden;
    color: var(--app-text-heading);
    font-size: 14px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  p { margin: 4px 0 0; overflow-wrap: anywhere; }
}

.whitelist-workspace {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(0, 1.2fr) minmax(380px, 0.9fr);
  gap: 20px;

  &__main,
  &__aside { display: grid; min-width: 0; gap: 20px; }
}

.subject-sections {
  display: grid;
  padding: 8px 24px 24px;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.field-section {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dce9e8;
  border-radius: 14px;
  background: #fff;

  > header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid #dce9e8;
    background: #f0faf8;

    > span {
      display: inline-flex;
      width: 34px;
      height: 34px;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      color: #0b9f98;
      background: #e6f8f5;
    }
    h3 { margin: 0; color: var(--app-text-heading); font-size: 15px; font-weight: 650; }
    p { margin: 3px 0 0; color: var(--app-text-label); font-size: 12px; }
  }

  &:nth-child(2) {
    border-color: #dce5f2;

    > header {
      border-bottom-color: #dce5f2;
      background: #f3f7fc;

      > span {
        color: #256fc5;
        background: #e5effb;
      }
    }
  }

  .field-grid {
    padding: 2px 16px 14px;
  }
}

.field-grid {
  display: grid;
  margin: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;

  > div { min-width: 0; padding: 13px 0; border-bottom: 1px dashed #dfe7ef; }
  .is-wide { grid-column: 1 / -1; }
  dt { color: var(--app-text-label); font-size: 12px; }
  dd {
    margin: 6px 0 0;
    color: var(--app-text-body);
    font-size: 14px;
    font-weight: 550;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
  .is-mono { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 13px; }
}

.panel-field-grid { padding: 4px 24px 24px; }
.timeline-panel { padding: 22px; }

.timeline-files {
  margin-top: 14px;
  overflow: hidden;
  border: 1px solid #e0e8f0;
  border-radius: 11px;
  background: #fbfcfe;

  &__count {
    margin: 0 !important;
    padding: 9px 12px;
    border-bottom: 1px solid #e6edf3;
    color: #087f7b !important;
    background: #f1faf8;
    font-size: 12px !important;
    font-weight: 600 !important;
  }
}

.file-list {
  display: grid;
  padding: 8px;

  article {
    display: grid;
    min-width: 0;
    align-items: center;
    padding: 10px 8px;
    border-radius: 9px;
    grid-template-columns: 46px minmax(0, 1fr) auto;
    gap: 12px;
    &:hover { background: #f1f6fa; }
  }
  &__type {
    display: inline-flex;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    color: #126df0;
    background: #e9f2ff;
    font-size: 10px;
    font-weight: 700;
  }
  &__info {
    min-width: 0;
    strong { display: block; overflow: hidden; color: var(--app-text-body); font-size: 13px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
    p { margin: 4px 0 0; color: var(--app-text-label); font-size: 12px; }
  }
  &__actions {
    display: flex;
    gap: 8px;
    :deep(.el-button + .el-button) { margin-left: 0; }
  }
}

@include narrow {
  .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .summary-grid article:nth-child(2) { border-right: 0; }
  .summary-grid article:nth-child(-n + 2) { border-bottom: 1px solid #e4ebf2; }
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

  .whitelist-summary { padding: 0 16px; }
  .summary-grid { grid-template-columns: 1fr; }
  .summary-grid article {
    min-width: 0;
    padding: 16px 0;
    border-right: 0;
    border-bottom: 1px solid #e4ebf2;
  }
  .summary-grid article:last-child { border-bottom: 0; }
  .summary-grid strong,
  .summary-grid p { white-space: normal; overflow-wrap: anywhere; }

  .subject-sections { padding: 4px 16px 16px; gap: 12px; }
  .field-grid { grid-template-columns: 1fr; }
  .field-grid .is-wide { grid-column: auto; }
  .panel-field-grid { padding: 2px 16px 16px; }
  .whitelist-workspace__aside { grid-template-columns: 1fr; }

  .timeline-panel { padding: 18px 16px; }

  .file-list { padding: 6px; }
  .file-list article {
    align-items: start;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 10px;
  }
  .file-list__actions {
    display: grid;
    width: 100%;
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    :deep(.el-button) { width: 100%; min-width: 0; }
  }
}

@media (max-width: 480px) {
  .file-list__actions { grid-template-columns: 1fr; }
}
</style>
