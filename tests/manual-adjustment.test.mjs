import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { ref } from 'vue';
const source=readFileSync(new URL('../src/views/manual-adjustment/useManualAdjustment.ts',import.meta.url),'utf8');
test('manual detail sends documented type and ID, rejects invalid routes and handles failure',async()=>{
 const params={type:'manual_increase',id:'12'};const calls=[];let fail=false,unmount;
 const imports={vue:{ref,onMounted(){},onBeforeUnmount(fn){unmount=fn;}},'vue-router':{useRoute:()=>({params})},'@/api/modules/transaction':{fetchTransactionInfo:async payload=>{calls.push(payload);if(fail)throw Error('failed');return {transaction:{business_type:params.type},detail:{reason:'test'}};}}};
 const m={exports:{}};new Function('require','module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(id=>imports[id],m,m.exports);
 const state=m.exports.useManualAdjustment();await state.load();assert.deepEqual(calls[0],{business_type:'manual_increase',business_id:12});assert.equal(state.info.value.detail.reason,'test');
 params.type='manual_decrease';await state.load();assert.equal(calls[1].business_type,'manual_decrease');
 params.id='0';await state.load();assert.equal(calls.length,2);assert.equal(state.info.value,null);assert.ok(state.error.value);
 params.id='12';fail=true;await state.load();assert.equal(state.loading.value,false);assert.equal(state.info.value,null);
 fail=false;const pending=state.load();unmount();await pending;assert.equal(state.info.value,null);
});
