import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { ref } from 'vue';
function load(url, imports = {}) {
  const code = ts.transpileModule(readFileSync(url, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require','module','exports',code)(id => imports[id],module,module.exports);
  return module.exports;
}
test('both portals group display money without losing decimals, sign or large integer precision', () => {
  for (const path of ['../src/utils/formatMoney.ts','../../MTPay-web/src/utils/formatMoney.ts']) {
    const { formatMoney } = load(new URL(path, import.meta.url));
    for (const [value,expected] of [['1000000.000000','1,000,000.000000'],['900719925474099312345.012345','900,719,925,474,099,312,345.012345'],['-12345.00','-12,345.00'],['+1234.000 USDT','+1,234.000 USDT'],[0,'0'],[null,'—'],['','—'],['1,234.50','1,234.50'],['EX123456','EX123456']]) assert.equal(formatMoney(value),expected);
  }
});
test('list state restores applied filters and pagination on remount, reset clears them without new history', async () => {
  const route = {path:'/withdrawals',query:{keyword:'agent',status:'0',page:'3',limit:'30',unrelated:'keep'},hash:''};
  const calls=[];
  const use = load(new URL('../src/composables/useListQueryState.ts',import.meta.url),{'vue-router':{useRoute:()=>route,useRouter:()=>({replace:async target=>{calls.push(target);route.query=target.query;}})}}).useListQueryState;
  const fields=()=>({keyword:ref(''),status:ref(),page:ref(1),limit:ref(15)});
  const first=fields(); const save=use(first,['status']);
  assert.equal(first.status.value,0); assert.equal(first.page.value,3); assert.equal(first.limit.value,30);
  first.keyword.value='draft'; assert.equal(route.query.keyword,'agent');
  await save(); assert.equal(route.query.keyword,'draft');
  const returned=fields();use(returned,['status']);assert.equal(returned.keyword.value,'draft');assert.equal(returned.page.value,3);
  first.keyword.value='';first.status.value=undefined;first.page.value=1;first.limit.value=15;await save();assert.deepEqual(route.query,{unrelated:'keep'});
  route.path='/withdrawals/detail/1';first.keyword.value='late';await save();assert.equal(calls.length,2);
});
test('invalid and array pagination do not override defaults', () => {
  const use=load(new URL('../src/composables/useListQueryState.ts',import.meta.url),{'vue-router':{useRoute:()=>({path:'/agents',query:{page:'0',limit:['500'],status:'NaN'}}),useRouter:()=>({})}}).useListQueryState;
  const fields={page:ref(1),limit:ref(15),status:ref()};use(fields,['status']);assert.equal(fields.page.value,1);assert.equal(fields.limit.value,15);assert.equal(fields.status.value,undefined);
});
