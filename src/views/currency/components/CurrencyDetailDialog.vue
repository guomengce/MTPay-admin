<template>
  <el-dialog
    :model-value="modelValue"
    width="720px"
    class="currency-detail-dialog"
    :show-close="false"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="currency-detail__header">
        <div class="currency-detail__identity">
          <span class="currency-detail__avatar">
            {{ detail?.currency.code.slice(0, 1) ?? 'C' }}
          </span>
          <div>
            <div class="currency-detail__title-line">
              <h2>
                {{ detail ? `${detail.currency.name} / ${detail.network.name}` : '币种详情' }}
              </h2>
              <StatusBadge
                v-if="detail"
                :label="detail.status_name"
                :type="detail.status === 1 ? 'success' : 'danger'"
              />
              <StatusBadge
                v-if="detail"
                :label="detail.is_effective ? '有效' : '无效'"
                :type="detail.is_effective ? 'primary' : 'gray'"
              />
            </div>
            <p>
              {{
                detail ? `${detail.currency.code} · ${detail.network.code}` : '正在读取币种资料…'
              }}
            </p>
          </div>
        </div>
        <el-button
          circle
          text
          :icon="Close"
          aria-label="关闭"
          @click="emit('update:modelValue', false)"
        />
      </div>
    </template>

    <div v-loading="loading" class="currency-detail__body">
      <template v-if="detail">
        <section class="currency-detail__section">
          <div class="currency-detail__section-title">
            <span
              ><el-icon><Coin /></el-icon
            ></span>
            <div>
              <h3>基础资料</h3>
              <p>币种与网络基础信息</p>
            </div>
          </div>
          <div class="currency-detail__info-grid">
            <article>
              <small>币种名称</small>
              <strong>{{ detail.currency.name }}</strong>
            </article>
            <article>
              <small>币种代码</small>
              <strong class="is-mono">{{ detail.currency.code }}</strong>
            </article>
            <article>
              <small>网络名称</small>
              <strong>{{ detail.network.name }}</strong>
            </article>
            <article>
              <small>网络代码</small>
              <strong class="is-mono">{{ detail.network.code }}</strong>
            </article>
          </div>
        </section>

        <section class="currency-detail__section">
          <div class="currency-detail__section-title">
            <span
              ><el-icon><Position /></el-icon
            ></span>
            <div>
              <h3>当前收款地址</h3>
              <p>平台正在使用的地址，旧地址由后端停用并保留</p>
            </div>
          </div>
          <article class="currency-detail__current">
            <strong v-if="detail.current_receiving_address" class="is-mono">
              {{ detail.current_receiving_address.address }}
            </strong>
            <span v-else class="currency-detail__empty">暂未设置</span>
            <small v-if="detail.current_receiving_address">
              启用时间：{{ detail.current_receiving_address.activated_at }}
            </small>
          </article>
        </section>
        <section class="currency-detail__section">
          <div class="currency-detail__section-title">
            <span
              ><el-icon><List /></el-icon
            ></span>
            <div>
              <h3>历史收款地址</h3>
              <p>仅展示，不可删除；新地址由后端停用旧地址</p>
            </div>
          </div>
          <ul v-if="detail.receiving_addresses?.length" class="currency-detail__history">
            <li
              v-for="addr in detail.receiving_addresses"
              :key="addr.id"
              :class="{ 'is-effective': addr.is_effective }"
            >
              <div class="address-line">
                <strong class="is-mono">{{ addr.address }}</strong>
                <StatusBadge v-if="addr.is_effective" label="当前有效" type="primary" />
                <StatusBadge
                  v-else
                  :label="addr.status_name"
                  :type="addr.status === 1 ? 'success' : 'gray'"
                />
              </div>
              <p v-if="addr.remark" class="remark">{{ addr.remark }}</p>
              <div class="time-line">
                <span>启用：{{ addr.activated_at }}</span>
                <span v-if="addr.deactivated_at">停用：{{ addr.deactivated_at }}</span>
                <span v-else class="muted">仍在使用</span>
              </div>
            </li>
          </ul>
          <p v-else class="currency-detail__empty">暂无历史地址记录</p>
        </section>
      </template>
    </div>

    <template #footer>
      <div class="currency-detail__footer">
        <el-button @click="emit('update:modelValue', false)">关闭</el-button>
        <div class="currency-detail__primary-actions">
          <el-button
            plain
            type="warning"
            :icon="Edit"
            :disabled="loading"
            @click="emit('set-address')"
          >
            {{ detail?.current_receiving_address ? '更换地址' : '设置地址' }}
          </el-button>
          <el-button
            plain
            :type="detail?.status === 1 ? 'info' : 'primary'"
            :icon="detail?.status === 1 ? CircleClose : CircleCheck"
            :disabled="loading"
            @click="emit('toggle-status')"
          >
            {{ detail?.status === 1 ? '禁用' : '启用' }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  CircleCheck,
  CircleClose,
  Clock,
  Close,
  Coin,
  Edit,
  List,
  Position,
} from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { CurrencyNetworkDetail } from '@/api/modules/currency';

defineProps<{
  modelValue: boolean;
  detail: CurrencyNetworkDetail | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'set-address'): void;
  (event: 'toggle-status'): void;
}>();
</script>

<style lang="scss">
.currency-detail-dialog {
  overflow: hidden;
  border-radius: 18px;
  padding: 0;
}
.currency-detail-dialog .el-dialog__header,
.currency-detail-dialog .el-dialog__body,
.currency-detail-dialog .el-dialog__footer {
  margin: 0;
  padding: 0;
}

.currency-detail {
  &__header {
    display: flex;
    min-height: 112px;
    align-items: center;
    justify-content: space-between;
    padding: 24px 28px;
    color: #ffffff;
    background:
      radial-gradient(circle at 80% 0, rgb(38 224 211 / 24%), transparent 38%),
      linear-gradient(135deg, #061d3d, #0b3760);
  }

  &__header :deep(.el-button) {
    color: #d8e8f8;
    font-size: 20px;
  }

  &__identity {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 16px;
  }

  &__avatar {
    display: grid;
    width: 58px;
    height: 58px;
    flex: 0 0 58px;
    place-items: center;
    border: 1px solid rgb(255 255 255 / 30%);
    border-radius: 16px;
    background: linear-gradient(135deg, #27dbc8, #1799c6);
    box-shadow: 0 12px 30px rgb(10 224 206 / 22%);
    font-size: 26px;
    font-weight: 600;
  }

  &__title-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  &__title-line h2 {
    margin: 0;
    overflow: hidden;
    font-size: 22px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__identity p {
    margin: 7px 0 0;
    color: #aac6df;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  &__body {
    min-height: 320px;
    padding: 26px 28px 8px;
    background: #f7f9fc;
  }

  &__section {
    margin-bottom: 22px;
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 13px;
  }

  &__section-title > span {
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border-radius: 10px;
    color: #079e94;
    background: #e5f8f5;
    font-size: 18px;
  }

  &__section-title h3 {
    margin: 0;
    color: #0a1d38;
    font-size: 15px;
  }

  &__section-title p {
    margin: 3px 0 0;
    color: #8795a9;
    font-size: 12px;
  }

  &__info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  &__info-grid article {
    display: grid;
    gap: 7px;
    padding: 15px 16px;
    border: 1px solid #e2e8f1;
    border-radius: 11px;
    background: #fff;
    box-shadow: 0 5px 14px rgb(23 53 87 / 4%);
  }

  &__info-grid small {
    color: #8190a5;
    font-size: 12px;
    font-weight: 600;
  }

  &__info-grid strong {
    overflow-wrap: anywhere;
    color: #15243a;
    font-size: 14px;
  }

  &__info-grid strong.is-mono {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  }

  &__current {
    display: grid;
    gap: 6px;
    padding: 16px 18px;
    border: 1px solid #e2e8f1;
    border-radius: 11px;
    background: #fff;
    box-shadow: 0 5px 14px rgb(23 53 87 / 4%);

    strong {
      overflow-wrap: anywhere;
      color: #126df0;
      font-size: 14px;
    }

    strong.is-mono {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
    }

    small {
      color: #6b7c93;
      font-size: 12px;
      font-weight: 600;
    }
  }

  &__empty {
    padding: 18px 22px;
    border: 1px dashed #d6dde7;
    border-radius: 10px;
    color: #94a4b9;
    font-size: 13px;
    font-style: italic;
    text-align: center;
  }

  &__history {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__history li {
    display: grid;
    gap: 6px;
    padding: 14px 16px;
    border: 1px solid #e2e8f1;
    border-radius: 11px;
    background: #fff;
    box-shadow: 0 5px 14px rgb(23 53 87 / 4%);
  }

  &__history li.is-effective {
    border-color: rgb(18 109 240 / 35%);
    background: linear-gradient(135deg, #f3f8ff, #ffffff);
  }

  &__history .address-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  &__history strong {
    overflow-wrap: anywhere;
    color: #15243a;
    font-size: 13px;
  }

  &__history strong.is-mono {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  }

  &__history .remark {
    margin: 0;
    color: #52637b;
    font-size: 12px;
    line-height: 1.5;
  }

  &__history .time-line {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    color: #6b7c93;
    font-size: 11px;
    font-weight: 600;
  }

  &__history .muted {
    color: #b1bcca;
    font-style: italic;
  }

  &__footer {
    display: flex;
    min-height: 76px;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 28px;
    border-top: 1px solid #e5eaf1;
    background: #fff;
  }

  &__primary-actions {
    display: flex;
    gap: 10px;
  }
}

@include mobile {
  .currency-detail-dialog {
    width: calc(100% - 24px) !important;
  }

  .currency-detail__header {
    min-height: 96px;
    padding: 20px;
  }

  .currency-detail__avatar {
    width: 48px;
    height: 48px;
    flex-basis: 48px;
    border-radius: 13px;
  }

  .currency-detail__title-line {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .currency-detail__title-line h2 {
    max-width: 220px;
    font-size: 18px;
  }

  .currency-detail__body {
    padding: 20px 18px 6px;
  }

  .currency-detail__info-grid {
    grid-template-columns: 1fr;
  }

  .currency-detail__footer {
    align-items: stretch;
    flex-direction: column;
    padding: 15px 18px;
  }

  .currency-detail__primary-actions {
    flex-direction: column;
    width: 100%;
  }

  .currency-detail__primary-actions :deep(.el-button) {
    width: 100%;
  }
}
</style>
