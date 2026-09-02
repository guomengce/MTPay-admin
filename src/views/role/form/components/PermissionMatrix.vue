<template>
  <section class="permission-matrix">
    <div class="heading">
      <strong>權限配置</strong>
      <div class="heading__actions">
        <el-checkbox :model-value="allSelected" :indeterminate="allIndeterminate" @change="toggleAll">全選全部權限</el-checkbox>
        <span>已選 {{ modelValue.menus.length }} 個模塊 / {{ modelValue.actions.length }} 項操作</span>
      </div>
    </div>
    <div class="layout">
      <el-menu :default-active="activeCode" class="menu" @select="activeCode=$event">
        <el-menu-item v-for="group in groups" :key="group.code" :index="group.code"><span>{{ group.name }}</span><em :class="{ 'is-enabled': modelValue.menus.includes(group.code) }">{{ modelValue.menus.includes(group.code)?'已啓用':'未啓用' }}</em></el-menu-item>
      </el-menu>
      <section v-if="currentGroup" class="content">
        <header>
          <el-checkbox :model-value="menuSelected" @change="toggleMenu">允許訪問 {{ currentGroup.name }}</el-checkbox>
          <el-checkbox :model-value="currentGroupSelected" :indeterminate="currentGroupIndeterminate" @change="toggleCurrentGroup">全選本模塊</el-checkbox>
        </header>
        <el-checkbox-group :model-value="modelValue.actions" :disabled="!menuSelected" @update:model-value="updateActions">
          <div class="actions"><label v-for="action in currentGroup.actions" :key="action.code"><el-checkbox :value="action.code">{{ action.name }}</el-checkbox></label><el-empty v-if="!currentGroup.actions.length" description="此模塊沒有操作權限" :image-size="60" /></div>
        </el-checkbox-group>
      </section>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PermissionCatalogItem, RolePayload } from '../../types';
const props=defineProps<{groups:PermissionCatalogItem[];modelValue:RolePayload}>();
const emit=defineEmits<{(e:'update:modelValue',v:RolePayload):void}>();
const activeCode=ref('');
watch(()=>props.groups,(groups)=>{if(!activeCode.value&&groups[0])activeCode.value=groups[0].code},{immediate:true});
const currentGroup=computed(()=>props.groups.find(item=>item.code===activeCode.value)||props.groups[0]);
const menuSelected=computed(()=>Boolean(currentGroup.value&&props.modelValue.menus.includes(currentGroup.value.code)));
const allMenuCodes=computed(()=>[...new Set(props.groups.map(item=>item.code))]);
const allActionCodes=computed(()=>[...new Set(props.groups.flatMap(item=>item.actions.map(action=>action.code)))]);
const allSelected=computed(()=>allMenuCodes.value.length>0&&allMenuCodes.value.every(code=>props.modelValue.menus.includes(code))&&allActionCodes.value.every(code=>props.modelValue.actions.includes(code)));
const allIndeterminate=computed(()=>!allSelected.value&&(props.modelValue.menus.length>0||props.modelValue.actions.length>0));
const currentActionCodes=computed(()=>currentGroup.value?.actions.map(item=>item.code)??[]);
const currentGroupSelected=computed(()=>menuSelected.value&&currentActionCodes.value.every(code=>props.modelValue.actions.includes(code)));
const currentGroupIndeterminate=computed(()=>!currentGroupSelected.value&&(menuSelected.value||currentActionCodes.value.some(code=>props.modelValue.actions.includes(code))));
function toggleMenu(value:unknown){if(!currentGroup.value)return;const menus=new Set(props.modelValue.menus);const actions=new Set(props.modelValue.actions);if(value)menus.add(currentGroup.value.code);else{menus.delete(currentGroup.value.code);currentGroup.value.actions.forEach(item=>actions.delete(item.code));}emit('update:modelValue',{...props.modelValue,menus:[...menus],actions:[...actions]});}
function toggleAll(value:unknown){emit('update:modelValue',{...props.modelValue,menus:value?[...allMenuCodes.value]:[],actions:value?[...allActionCodes.value]:[]});}
function toggleCurrentGroup(value:unknown){if(!currentGroup.value)return;const menus=new Set(props.modelValue.menus);const actions=new Set(props.modelValue.actions);if(value){menus.add(currentGroup.value.code);currentActionCodes.value.forEach(code=>actions.add(code));}else{menus.delete(currentGroup.value.code);currentActionCodes.value.forEach(code=>actions.delete(code));}emit('update:modelValue',{...props.modelValue,menus:[...menus],actions:[...actions]});}
function updateActions(value:string[]){emit('update:modelValue',{...props.modelValue,actions:[...new Set(value)]});}
</script>
<style scoped lang="scss">
.permission-matrix{background:#fff}.heading{display:flex;align-items:center;justify-content:space-between;padding:15px 20px;border-bottom:1px solid #dfe8ef;background:#f8fbfd}.heading__actions{display:flex;align-items:center;gap:22px}.heading span{color:#718298;font-size:12px}.layout{display:grid;height:500px;grid-template-columns:230px 1fr;overflow:hidden}.menu{height:500px;overflow-x:hidden;overflow-y:auto;border-right:1px solid #dfe8ef;scrollbar-color:transparent transparent;scrollbar-width:thin}.menu:hover{scrollbar-color:rgb(8 156 145 / 28%) transparent}.menu::-webkit-scrollbar{width:5px}.menu::-webkit-scrollbar-track{background:transparent}.menu::-webkit-scrollbar-thumb{border-radius:10px;background:transparent;transition:background .2s ease}.menu:hover::-webkit-scrollbar-thumb{background:rgb(8 156 145 / 22%)}.menu:hover::-webkit-scrollbar-thumb:hover{background:rgb(8 156 145 / 42%)}.menu em{margin-left:auto;padding:3px 8px;border:1px solid #d9e2ec;border-radius:999px;color:#8293a8;background:#f5f7fa;font-size:11px;font-style:normal;line-height:1.2}.menu em.is-enabled{border-color:#9bded7;color:#087f78;background:#e6f7f4;font-weight:600}.content{height:500px;overflow-y:auto;padding:20px}.content>header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding-bottom:15px;border-bottom:1px solid #e5edf3}.actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding-top:18px}.actions label{padding:13px;border:1px solid #e0e9f0;border-radius:10px;background:#fbfdff}@include mobile{.heading{align-items:flex-start;flex-direction:column;gap:10px}.heading__actions{width:100%;align-items:flex-start;flex-direction:column;gap:6px}.layout{height:auto;min-height:420px;grid-template-columns:1fr;overflow:visible}.menu{display:flex;width:100%;height:auto;overflow-x:auto;overflow-y:hidden;border-right:0}.content{height:auto;min-height:360px;overflow:visible}.content>header{align-items:flex-start;flex-direction:column;gap:8px}.actions{grid-template-columns:1fr}}
</style>
