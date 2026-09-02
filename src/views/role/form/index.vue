<template>
    <section class="role-form-page">
        <header class="toolbar">
            <div><el-button :icon="Back" plain @click="back">返回</el-button>
                <h1>{{ isEdit ? '編輯角色' : '新增角色' }}</h1>
            </div>
            <div><el-button @click="back">取消</el-button><el-button type="primary" :icon="Check" :loading="submitting"
                    @click="submit">保存</el-button></div>
        </header><el-form ref="formRef" :model="form" :rules="rules" label-position="top"><el-card class="role-editor"
                shadow="never">
                <RoleBasicForm :model-value="form" @update:model-value="updateForm" />
                <PermissionMatrix :model-value="form" :groups="catalog" @update:model-value="updateForm" />
            </el-card></el-form>
    </section>
</template>
<script setup
    lang="ts">    import { computed, onMounted, reactive, ref } from 'vue'; import type { FormInstance, FormRules } from 'element-plus'; import { ElMessage } from 'element-plus'; import { Back, Check } from '@element-plus/icons-vue'; import { useRoute, useRouter } from 'vue-router'; import RoleBasicForm from './components/RoleBasicForm.vue'; import PermissionMatrix from './components/PermissionMatrix.vue'; import { createRole, fetchPermissionCatalog, fetchRoleInfo, updateRole, type PermissionCatalogItem, type RolePayload } from '@/api/modules/role'; const route = useRoute(), router = useRouter(), formRef = ref<FormInstance>(), submitting = ref(false), catalog = ref<PermissionCatalogItem[]>([]); const id = computed(() => Number(route.params.id) || undefined), isEdit = computed(() => Boolean(id.value)); const form = reactive<RolePayload>({ name: '', description: '', menus: [], actions: [] }); const rules: FormRules<RolePayload> = { name: [{ required: true, message: '請輸入角色名稱', trigger: 'blur' }, { max: 50, message: '角色名稱不能超過 50 個字符', trigger: 'blur' }], description: [{ max: 200, message: '角色描述不能超過 200 個字符', trigger: 'blur' }], menus: [{ type: 'array', required: true, min: 1, message: '請至少選擇一個菜單', trigger: 'change' }] }; function unique(values: string[]) { return [...new Set(values)]; } function updateForm(value: RolePayload) { Object.assign(form, value, { menus: unique(value.menus), actions: unique(value.actions) }) } onMounted(async () => { catalog.value = await fetchPermissionCatalog(); if (id.value) { const role = await fetchRoleInfo(id.value); Object.assign(form, { name: role.name, description: role.description || '', menus: unique(role.menus), actions: unique(role.actions) }) } }); function back() { history.length > 1 ? router.go(-1) : void router.push({ name: 'RoleManagement' }) } async function submit() { if (!(await formRef.value?.validate().catch(() => false))) return; submitting.value = true; try { const payload = { name: form.name.trim(), description: form.description?.trim() || undefined, menus: unique(form.menus), actions: unique(form.actions) }; id.value ? await updateRole({ ...payload, id: id.value }) : await createRole(payload); ElMessage.success(isEdit.value ? '角色已更新' : '角色已新增'); await router.replace({ name: 'RoleManagement' }) } finally { submitting.value = false } }</script>
<style scoped
    lang="scss">
    .role-form-page {
        display: grid;
        gap: 16px
    }

    .toolbar,
    .toolbar>div {
        display: flex;
        align-items: center
    }

    .toolbar {
        justify-content: space-between;
        gap: 16px
    }

    .toolbar>div {
        gap: 12px
    }

    .toolbar h1 {
        margin: 0;
        font-size: 24px
    }

    .el-form {
        display: grid;
        gap: 16px
    }

    .role-editor {
        overflow: hidden;
        border-color: #dfe8ef;
        border-radius: 15px
    }

    .role-editor :deep(.el-card__body) {
        padding: 0
    }

    @include mobile {
        .toolbar {
            align-items: flex-start;
            flex-direction: column
        }
    }
</style>
