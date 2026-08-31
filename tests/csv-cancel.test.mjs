import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import {ref,reactive,toRefs} from 'vue';
const read=p=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
function load(path,imports) {const m={exports:{}};const s=ts.transpileModule(read(path),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;new Function('require','module','exports',s)(n=>imports[n],m,m.exports);return m.exports;}
test('four CSV endpoints receive only documented filters, preserve zero, omit pagination', async()=>{
 const calls=[];const api=load('api/modules/csvExport.ts',{'../request':{default:{get:async(...args)=>calls.push(args)}}});
 const q={keyword:'  test  ',status:0,role:2,entity_type:1,started_at:'2026-08-01',ended_at:'2026-08-28',page:3,limit:15};
 for(const mod of ['deposit','exchange','whitelist','withdrawal']) await api.exportBusinessCsv(mod,q);
 const url=i=>new URL(calls[i][0],'https://test.invalid');
 assert.deepEqual(calls.map((c,i)=>url(i).pathname),['/admin/exportDepositCsv','/admin/exportExchangeCsv','/admin/exportWhitelistCsv','/admin/exportWithdrawalCsv']);
 assert.deepEqual(calls[0][1],{responseType:'blob'});
 assert.deepEqual(Object.fromEntries(url(0).searchParams),{keyword:'test',started_at:q.started_at,ended_at:q.ended_at});
 assert.deepEqual(Object.fromEntries(url(2).searchParams),{keyword:'test',role:'2',entity_type:'1'});
 assert.equal(url(1).searchParams.get('status'),'0');assert.equal(url(3).searchParams.get('status'),'0');
 await api.exportBusinessCsv('withdrawal',{});assert.equal(url(4).searchParams.get('status'),'');
 await api.exportBusinessCsv('exchange',{...q,status:1,keyword:'A&B + 公司'});
 assert.equal(url(5).searchParams.get('status'),'1');assert.equal(url(5).searchParams.get('keyword'),'A&B + 公司');
 await api.exportBusinessCsv('withdrawal',{...q,status:3});assert.equal(url(6).searchParams.get('status'),'3');
 for(let i=0;i<calls.length;i++){assert.equal(url(i).searchParams.has('page'),false);assert.equal(url(i).searchParams.has('limit'),false);}
 for(const mod of ['deposit','exchange','whitelist','withdrawal']) assert.doesNotMatch(read('views/'+mod+'/index.vue'),/exportPagedCsv|fetchPage:/);
});
test('completed withdrawal cancellation uses form-data and optional reason',async()=>{
 let call;const api=load('api/modules/withdrawal.ts',{'../request':{default:{post:async(...args)=>call=args}}});
 await api.cancelCompletedWithdrawal(12,' reason ');assert.equal(call[0],'/admin/cancelCompletedWithdrawal');assert.ok(call[1] instanceof FormData);assert.equal(call[1].get('id'),'12');assert.equal(call[1].get('reason'),'reason');
 await api.cancelCompletedWithdrawal(12,'');assert.equal(call[1].has('reason'),false);
});

test('all four exports use the same successful filter snapshot as their displayed list',async()=>{
 for(const mod of ['deposit','exchange','whitelist','withdrawal']) {
  const cap=mod[0].toUpperCase()+mod.slice(1);let requestParams;
  const state=load(`views/${mod}/composables/use${cap}List.ts`,{
   vue:{ref,reactive,toRefs,onMounted(){},watch(){}},
   '@/composables/useListQueryState':{useListQueryState:()=>async()=>{}},
   [`@/api/modules/${mod}`]:{[`fetch${cap}List`]:async params=>{requestParams=params;return{data:[],total:3,current_page:1,per_page:15};}},
   './mapper':{[`to${cap}Row`]:row=>row},
  })[`use${cap}List`]();
  assert.equal(state.exportFilters.value,null);
  const filters=mod==='whitelist'?{keyword:'company',role:2,entity_type:1}:{keyword:'company',started_at:'2026-08-01',ended_at:'2026-08-28',...(mod==='deposit'?{}:{status:mod==='exchange'?1:3})};
  Object.assign(state.query,filters);await state.loadList();
  for(const [key,value] of Object.entries(filters)){assert.equal(requestParams[key],value);assert.equal(state.exportFilters.value[key],value);}
  state.query.keyword='not queried';assert.equal(state.exportFilters.value.keyword,'company');
  assert.match(read(`views/${mod}/index.vue`),/\(\) => exportFilters.value/);
 }
});
test('cancel action checks completed status and requires confirmation before changing the order',async()=>{
 let resolve,calls=0,refresh=0;const imports={vue:{ref},'element-plus':{ElMessage:{success(){}},ElMessageBox:{prompt:()=>new Promise(done=>resolve=done)}},'@/api/modules/withdrawal':{cancelCompletedWithdrawal:async(id,reason)=>{calls++;assert.equal(id,12);assert.equal(reason,'reviewed');}}};
 const flow=load('views/withdrawal/composables/useCancelCompletedWithdrawal.ts',imports).useCancelCompletedWithdrawal(async()=>refresh++);
 await flow.cancelCompleted({businessId:12,id:'WD12',statusCode:2});assert.equal(calls,0);
 const promise=flow.cancelCompleted({businessId:12,id:'WD12',statusCode:3});await flow.cancelCompleted({businessId:12,id:'WD12',statusCode:3});assert.equal(calls,0);
 resolve({value:'reviewed'});await promise;assert.equal(calls,1);assert.equal(refresh,1);assert.equal(flow.cancelling.value,false);
 imports['element-plus'].ElMessageBox.prompt=async()=>{throw 'cancel';};await flow.cancelCompleted({businessId:12,id:'WD12',statusCode:3});assert.equal(calls,1);
});
