<template>
    <div class="role-filters filter-bar"><el-input class="filter-bar__keyword" :model-value="keyword" clearable :prefix-icon="Search" placeholder="角色名稱"
            @update:model-value="emit('update:keyword', String($event))" @keyup.enter="emit('search')" />
        <div class="filter-bar__actions"><el-button type="primary" :icon="Search" @click="emit('search')">查詢</el-button><el-button
                plain :icon="RefreshLeft" @click="emit('reset')">重置</el-button></div>
    </div>
</template>
<script setup
    lang="ts">    import { RefreshLeft, Search } from '@element-plus/icons-vue'; defineProps<{ keyword: string }>(); const emit = defineEmits<{ (e: 'update:keyword', v: string): void; (e: 'search'): void; (e: 'reset'): void }>();</script>
