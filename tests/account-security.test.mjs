import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {parse,compileScript} from '@vue/compiler-sfc';
import ts from 'typescript';
import {ref,computed} from 'vue';
const read=path=>readFileSync(new URL('../src/'+path,import.meta.url),'utf8');
test('admin 1 cannot start 2FA; normal admin can start and secret is cleared on unmount',async()=>{
 for(const id of ['1','2']) {
 let starts=0,unmount;const source=compileScript(parse(read('views/account/components/TwoFactorCard.vue')).descriptor,{id:'test'}).content;
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const imports={vue:{ref,computed,watch(){},onMounted(){},onBeforeUnmount:fn=>unmount=fn,defineComponent:x=>x},'../messages':{accountText:x=>x},'@/stores/modules/auth':{useAuthStore:()=>({userInfo:{id},token:'token'})},'@/api/modules/twoFactor':{startTwoFactorSetup:async()=>{starts++;return {otpauth_uri:'otpauth://totp/test',manual_key:'key'};}}};
 const m={exports:{}};new Function('require','module','exports',js)(n=>imports[n]||{},m,m.exports);const vm=m.exports.default.setup({}, {expose(){}});vm.enabled.value=false;await vm.start();assert.equal(starts,id==='1'?0:1);unmount();assert.equal(vm.setup.value,null);
 }
});
test('management uses only own 2FA endpoints and protected account route',()=>{
 const api=read('api/modules/twoFactor.ts');for(const path of ['getTwoFactorStatus','startTwoFactorSetup','confirmTwoFactorSetup','disableOwnTwoFactor']) assert.ok(api.includes('/admin/'+path));
 assert.doesNotMatch(api,/\/web\//);
 assert.match(read('router/modules/index.ts'),/title: '账户与安全'.*requiresAuth: true/);
 assert.match(read('layout/components/AppHeader.vue'),/command="account"/);
});


test('rendered 2FA card shows entry buttons only outside setup and disable forms', async () => {
 const vue = await import('vue');
 const { renderToString } = await import('@vue/server-renderer');
 const { compileScript, parse } = await import('@vue/compiler-sfc');
 const source = readFileSync(new URL('../src/views/account/components/TwoFactorCard.vue', import.meta.url), 'utf8');
 const web = source.includes('vue-i18n');
 const compiled = compileScript(parse(source).descriptor, { id: 'card-test', inlineTemplate: true }).content;
 const js = ts.transpileModule(compiled, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
 for (const mode of ['idle', 'setup', 'disable']) {
   let refIndex = 0;
   const imports = {
     vue: { ...vue, onMounted() {}, onBeforeUnmount() {}, watch() {}, ref(value) {
       const index = refIndex++;
       if (index === 0) value = mode === 'disable';
       if (index === 1 && mode === 'setup') value = { otpauth_uri: 'otpauth://totp/test' };
       if (index === 6) value = mode === 'disable';
       return vue.ref(value);
     } },
     '@element-plus/icons-vue': { Lock: { render: () => vue.h('span') } },
     'vue-i18n': { useI18n: () => ({ t: key => key }) },
     '../messages': { accountText: key => key },
     '@/stores/modules/auth': { useAuthStore: () => ({ userInfo: { id: '2' }, token: 'token' }) },
     'qrcode.vue': { default: { render: () => vue.h('div', 'QR') } },
   };
   const m = { exports: {} };
   new Function('require', 'module', 'exports', js)(name => imports[name] || {}, m, m.exports);
   const app = vue.createSSRApp(m.exports.default);
   const passthrough = { setup(_, { slots }) { return () => vue.h('div', slots.default?.()); } };
   for (const name of ['el-form','el-form-item','el-input','el-button','el-icon','el-alert','el-tag']) app.component(name, passthrough);
   app.directive('loading', {});
   const html = await renderToString(app);
   assert.equal(html.includes('twoFactorSettings.start'), mode === 'idle', web ? 'agent' : 'admin');
   assert.equal(html.includes('twoFactorSettings.confirm'), mode !== 'idle');
 }
});

test('account cards use equal desktop columns and a single mobile column', async () => {
 const { compileStyle } = await import('@vue/compiler-sfc');
 const source = read('views/account/index.vue');
 const result = compileStyle({ source: parse(source).descriptor.styles[0].content, filename: 'account.vue', id: 'account-layout', scoped: true, preprocessLang: 'scss' });
 assert.deepEqual(result.errors, []);
 assert.match(result.code, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
 assert.match(result.code, /max-width: 1000px/);
 assert.match(source, /password-card__item-icon/);
});

test('closing another account 2FA requires confirmation, uses its id, blocks duplicate actions and refreshes', async () => {
 const { ref } = await import('vue');
 const source = ts.transpileModule(read('composables/useDisableAccountTwoFactor.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
 for (const kind of ['admin', 'agent']) {
  let confirm; let refreshed=0; const calls=[];
  const imports={vue:{ref},'element-plus':{ElMessage:{success(){}},ElMessageBox:{confirm:()=>new Promise(resolve=>confirm=resolve)}},'@/api/modules/twoFactor':{disableAdminTwoFactor:async id=>calls.push(['admin',id]),disableUserTwoFactor:async id=>calls.push(['agent',id])}};
  const m={exports:{}};new Function('require','module','exports',source)(n=>imports[n],m,m.exports);
  const flow=m.exports.useDisableAccountTwoFactor(kind,async()=>{refreshed++;});
  const pending=flow.disableTwoFactor({id:8,name:'Test'});await flow.disableTwoFactor({id:9});
  assert.equal(calls.length,0);confirm();await pending;assert.deepEqual(calls,[[kind,8]]);assert.equal(refreshed,1);assert.equal(flow.twoFactorBusy.value,false);
  imports['element-plus'].ElMessageBox.confirm=async()=>{throw 'cancel';};await flow.disableTwoFactor({id:9});assert.equal(calls.length,1);
 }
});
test('administrator deletion is removed and desktop/mobile lists expose disable 2FA',()=>{
 for(const path of ['api/modules/adminAccount.ts','views/permission/index.vue','views/permission/composables/useAdminManagement.ts']) assert.doesNotMatch(read(path),/delAdmin|deleteAdminAccount|command="delete"|key: 'delete'/);
 for(const path of ['views/permission/index.vue','views/agent/components/AgentTableList.vue','views/agent/components/AgentCardList.vue']) assert.match(read(path),/disable-2fa/);
});
