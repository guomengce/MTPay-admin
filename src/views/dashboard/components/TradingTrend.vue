<template>
  <AdminPanel class="trend-panel" title="近 7 日交易趨勢" subtitle="按訂單提交時間統計交易筆數">
    <template #extra>
      <span class="trend-panel__count"><i />共 {{ total }} 筆</span>
    </template>
    <div ref="chartRef" class="trend-panel__chart" role="img" aria-label="近七日交易趨勢柱狀圖" />
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { init, use, type ECharts, type EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import type { OperationTransactionTrend } from '@/api/modules/dashboard';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import { useAuthStore } from '@/stores/modules/auth';

use([BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const chartRef = ref<HTMLDivElement>();
const props = defineProps<{ trend: OperationTransactionTrend | null }>();
const authStore = useAuthStore();

const trendItems = computed(() => props.trend?.items ?? []);
const dates = computed(() => trendItems.value.map((item) => item.date.slice(5).replace('-', '/')));
const businessDefinitions = [
  { key: 'deposit', name: '入金', color: '#087f79' },
  { key: 'exchange', name: '數字貨幣兌換', color: '#2fb1aa' },
  { key: 'withdrawal', name: '法幣出金', color: '#8fd7d2' },
] as const;
const visibleBusinesses = computed(() => businessDefinitions.filter((business) =>
  (authStore.cryptoEnabled || !['deposit', 'exchange'].includes(business.key)) &&
  trendItems.value.some((item) => Object.prototype.hasOwnProperty.call(item, business.key)),
));
const total = computed(() => trendItems.value.reduce((sum, item) => sum + visibleBusinesses.value.reduce((itemSum, business) => itemSum + (item[business.key] ?? 0), 0), 0));
const chartSeries = computed(() => visibleBusinesses.value.map((business, businessIndex, businesses) => {
  const isFirst = businessIndex === 0;
  const isLast = businessIndex === businesses.length - 1;
  return {
    name: business.name,
    type: 'bar',
    stack: 'orders',
    data: trendItems.value.map((item) => isLast ? {
      value: item[business.key] ?? 0,
      label: { show: true, formatter: String(item.total ?? 0) },
    } : (item[business.key] ?? 0)),
    barWidth: 34,
    showBackground: isFirst,
    backgroundStyle: { color: '#e9eff2', borderRadius: 6 },
    itemStyle: { color: business.color, borderRadius: isFirst ? [0, 0, 5, 5] : isLast ? [5, 5, 0, 0] : 0 },
    label: isLast ? { show: true, position: 'top', color: '#4b5e73', fontSize: 11 } : undefined,
  };
}));

let chart: ECharts | undefined;
let resizeObserver: ResizeObserver | undefined;

function renderChart() {
  if (!chartRef.value) return;
  chart = init(chartRef.value);

  const option: EChartsCoreOption = {
    animationDuration: 650,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(7, 143, 135, 0.05)' } },
      backgroundColor: 'rgba(16, 39, 70, 0.94)',
      borderWidth: 0,
      padding: [10, 12],
      textStyle: { color: '#fff', fontSize: 12 },
    },
    legend: {
      top: 4,
      left: 0,
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 18,
      icon: 'circle',
      textStyle: { color: '#65768a', fontSize: 12 },
    },
    grid: { top: 54, left: 10, right: 8, bottom: 20, containLabel: true },
    xAxis: {
      type: 'category',
      data: dates.value,
      axisLine: { lineStyle: { color: '#dce5eb' } },
      axisTick: { show: false },
      axisLabel: { color: '#78879a', fontSize: 11, margin: 13 },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { lineStyle: { color: '#e8eef2', type: 'solid' } },
    },
    series: chartSeries.value,
  };

  chart.setOption(option);
  resizeObserver = new ResizeObserver(() => chart?.resize());
  resizeObserver.observe(chartRef.value);
}

onMounted(() => nextTick(renderChart));
watch(
  () => props.trend,
  () => {
    if (!chart) return;
    chart.setOption({
      xAxis: { data: dates.value },
      series: chartSeries.value,
    }, { replaceMerge: ['series'] });
  },
  { deep: true },
);
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});
</script>

<style scoped lang="scss">
.trend-panel {
  position: relative;
  min-height: 344px;
  border-color: #d5e3ed;
  background:
    radial-gradient(circle at 100% 0%, rgb(65 115 223 / 8%), transparent 32%),
    rgb(255 255 255 / 96%);
  box-shadow: 0 18px 42px rgb(13 49 80 / 8%);

  &::before {
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    left: 20px;
    width: 96px;
    height: 2px;
    background: linear-gradient(90deg, #1aa99f, transparent);
  }

  :deep(.admin-panel__header) {
    padding: 18px 20px;
  }

  :deep(.admin-panel__title) {
    gap: 0;
  }

  &__count {
    display: inline-flex;
    height: 29px;
    align-items: center;
    gap: 7px;
    padding: 0 11px;
    border-radius: 999px;
    color: #537082;
    background: #f0f5f6;
    font-size: 12px;
    font-weight: 700;

    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #079b91;
    }
  }

  &__chart {
    width: calc(100% - 32px);
    height: 266px;
    margin: 16px 16px 0;
    overflow: hidden;
    //border: 1px solid #e0e8ed;
    border-radius: 16px;
    //background: #f8fafb;
    box-shadow: inset 0 1px 0 #fff;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 20px 16px;
    color: var(--app-text-subtle);
    font-size: 11px;
  }
}

@include mobile {
  .trend-panel {
    min-height: 320px;

    &__chart {
      width: calc(100% - 24px);
      height: 220px;
      margin-inline: 12px;
    }

    &__footer {
      flex-direction: column;
      gap: 4px;
      padding-inline: 16px;
    }
  }
}
</style>
