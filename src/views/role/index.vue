<template>
    <section class="admin-page">
        <AdminHero title="角色管理" :icon="Key"><template #extra><el-button v-if="canOperate('roles.create')" type="primary"
                    :icon="Plus" @click="router.push({ name: 'RoleCreate' })">新增角色</el-button></template>
        </AdminHero>
        <AdminPanel>
            <RoleFilters v-model:keyword="keyword" @search="search" @reset="reset" />
            <ResponsiveList><template #desktop>
                    <RoleTableList :items="list" :loading="loading" :can-edit="canOperate('roles.edit')"
                        :can-delete="canOperate('roles.delete')" @edit="editRole" @delete="remove" />
                </template><template #mobile>
                    <RoleCardList :items="list" :can-edit="canOperate('roles.edit')"
                        :can-delete="canOperate('roles.delete')" @edit="editRole" @delete="remove" />
                </template>
            </ResponsiveList><el-empty v-if="!loading && !list.length" description="暫無角色" />
            <TablePager v-model="page" v-model:page-size="limit" :total="total" />
        </AdminPanel>
    </section>
</template>
<script setup
    lang="ts">    import { onMounted, ref, watch } from 'vue'; import { ElMessage, ElMessageBox } from 'element-plus'; import { Key, Plus } from '@element-plus/icons-vue'; import { useRouter } from 'vue-router'; import { deleteRole, fetchRoleList, type RoleItem } from '@/api/modules/role'; import { usePermission } from '@/composables/usePermission'; import AdminHero from '@/components/admin/AdminHero.vue'; import AdminPanel from '@/components/admin/AdminPanel.vue'; import ResponsiveList from '@/components/common/ResponsiveList.vue'; import TablePager from '@/components/common/TablePager.vue'; import RoleFilters from './components/RoleFilters.vue'; import RoleTableList from './components/RoleTableList.vue'; import RoleCardList from './components/RoleCardList.vue'; const router = useRouter(), { canOperate } = usePermission(), list = ref<RoleItem[]>([]), loading = ref(false), keyword = ref(''), page = ref(1), limit = ref(15), total = ref(0); async function load() { loading.value = true; try { const result = await fetchRoleList({ keyword: keyword.value.trim() || undefined, page: page.value, limit: limit.value }); list.value = result.data; total.value = result.total } finally { loading.value = false } } function search() { page.value === 1 ? void load() : page.value = 1 } function reset() { keyword.value = ''; search() } function editRole(row: RoleItem) { void router.push({ name: 'RoleEdit', params: { id: row.id } }) } async function remove(row: RoleItem) { if (row.admin_count > 0) return; await ElMessageBox.confirm(`確定刪除角色“${row.name}”嗎？`, '刪除角色', { type: 'warning' }); await deleteRole(row.id); ElMessage.success('角色已刪除'); await load() } watch([page, limit], load); onMounted(load);</script>
