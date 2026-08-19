<template>
  <AdminPanel class="trend-panel" title="近 7 日交易趋势" subtitle="按订单提交时间统计交易笔数">
    <template #extra>
      <span class="trend-panel__count"><i />共 {{ total }} 笔</span>
    </template>
    <div ref="chartRef" class="trend-panel__chart" role="img" aria-label="近七日交易趋势柱状图" />
    <footer class="trend-panel__footer">
      <span>悬停柱状图可查看每日明细</span>
      <span>仅统计笔数，不混算不同币种金额</span>
    </footer>
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

use([BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const chartRef = ref<HTMLDivElement>();
const props = defineProps<{ trend: OperationTransactionTrend | null }>();

const trendItems = computed(() => props.trend?.items ?? []);
const dates = computed(() => trendItems.value.map((item) => item.date.slice(5).replace('-', '/')));
const deposits = computed(() => trendItems.value.map((item) => item.deposit));
const exchanges = computed(() => trendItems.value.map((item) => item.exchange));
const withdrawals = computed(() => trendItems.value.map((item) => item.withdrawal));
const total = computed(() => props.trend?.total ?? 0);

let chart: ECharts | undefined;
let resizeObserver: ResizeObserver | undefined;

function renderChart() {
  if (!chartRef.value) return;
  chart = init(chartRef.value);

  const option: EChartsCoreOption = {
    animationDuration: 650,
    color: ['#087f79', '#2fb1aa', '#8fd7d2'],
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
    series: [
      {
        name: '入金',
        type: 'bar',
        stack: 'orders',
        data: deposits.value,
        barWidth: 34,
        showBackground: true,
        backgroundStyle: { color: '#e9eff2', borderRadius: 6 },
        itemStyle: { borderRadius: [0, 0, 5, 5] },
      },
      {
        name: '兑换',
        type: 'bar',
        stack: 'orders',
        data: exchanges.value,
      },
      {
        name: '出金',
        type: 'bar',
        stack: 'orders',
        data: withdrawals.value.map((value, index) => ({
          value,
          label: {
            show: true,
            formatter: String(trendItems.value[index]?.total ?? 0),
          },
        })),
        itemStyle: { borderRadius: [5, 5, 0, 0] },
        label: {
          show: true,
          position: 'top',
          color: '#4b5e73',
          fontSize: 11,
        },
      },
    ],
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
      series: [
        { data: deposits.value },
        { data: exchanges.value },
        {
          data: withdrawals.value.map((value, index) => ({
            value,
            label: {
              show: true,
              formatter: String(trendItems.value[index]?.total ?? 0),
            },
          })),
        },
      ],
    });
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
    height: 216px;
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
