import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
import { ref } from 'vue';
const read=p=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
const module={exports:{}};
new Function('exports',ts.transpileModule(read('views/transaction/businessDetailRoute.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(module.exports);
const {businessDetailRoute}=module.exports;
test('transactions open actual business detail using backend detail IDs',()=>{
 for(const [type,name] of Object.entries({deposit:'DepositDetail',exchange:'ExchangeDetail',withdrawal:'WithdrawalDetail',whitelist:'WhitelistDetail'})) assert.deepEqual(businessDetailRoute({business_type:type,business_id:7,detail_type:type,detail_id:12}),{name,params:{id:12}});
 for(const type of ['manual_increase','manual_decrease']) assert.deepEqual(businessDetailRoute({business_type:type,business_id:7,detail_type:type,detail_id:12}),{name:'ManualAdjustmentDetail',params:{type,id:12}});
 assert.equal(businessDetailRoute({business_type:'constructor',business_id:7}),null);
 assert.equal(businessDetailRoute({business_type:'deposit',business_id:7,detail_type:'deposit',detail_id:0}),null);
});
test('old page and routes are removed, and list/dashboard use business routing',()=>{
 assert.equal(existsSync(new URL('../src/views/transaction/detail/index.vue',import.meta.url)),false);
 assert.doesNotMatch(read('router/modules/index.ts'),/name: 'TransactionDetail'/);
 for(const path of ['views/transaction/index.vue','views/dashboard/components/AssetFlows.vue']) {assert.match(read(path),/businessDetailRoute\(row\)/);assert.doesNotMatch(read(path),/name:\s*'TransactionDetail'/);}
});
test('business and agent detail back buttons use browser history',()=>{
 for(const part of ['deposit','exchange','whitelist','withdrawal','flow']) assert.match(read('views/'+part+'/detail/index.vue'),/function goBack\(\) \{ router.go\(-1\); \}/);
 assert.match(read('views/agent/composables/useAgentOverview.ts'),/router.go\(-1\)/);
});

test('agent transactions navigate to business pages without a detail modal or detail API', async () => {
 const calls=[];
 const imports={vue:{ref,onMounted(){}},'element-plus':{},'vue-router':{useRoute:()=>({params:{id:'3'}}),useRouter:()=>({push:async target=>calls.push(target)})},'@/api/modules/agent':{},'@/api/modules/transaction':{},'./useAgentMail':{useAgentMail:()=>({})},'@/views/transaction/businessDetailRoute':{businessDetailRoute}};
 const exports={};
 const queries=[];
 const route={path:'/agent/3',params:{id:'3'},query:{page:'2'},hash:''};
 const routeImports={'vue-router':{useRoute:()=>route,useRouter:()=>({replace:async target=>{route.query=target.query;}})}};
 const queryExports={};
 new Function('require','exports',ts.transpileModule(read('composables/useListQueryState.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(id=>routeImports[id],queryExports);
 imports['@/composables/useListQueryState']=queryExports;
 imports['@/api/modules/transaction']={fetchTransactionList:async params=>{queries.push(params);return {data:[{order_no:'page-'+params.page}],total:46};}};
 new Function('require','exports',ts.transpileModule(read('views/agent/composables/useAgentOverview.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(id=>imports[id],exports);
 const state=exports.useAgentOverview();
 for(const type of ['deposit','exchange','withdrawal','whitelist']) await state.openTransaction({business_type:type,business_id:2,detail_type:type,detail_id:7});
 await state.openTransaction({business_type:'manual_increase',business_id:3});
 assert.deepEqual(calls.map(item=>item.name),['DepositDetail','ExchangeDetail','WithdrawalDetail','WhitelistDetail','ManualAdjustmentDetail']);
 assert.ok(calls.slice(0,4).every(item=>item.params.id===7));
 assert.deepEqual(calls[4].params,{type:'manual_increase',id:3});
 assert.equal(existsSync(new URL('../src/views/agent/components/AgentTransactionDialog.vue',import.meta.url)),false);
 assert.doesNotMatch(read('api/modules/agent.ts'),/AgentTransactionInfo|fetchAgentTransactionInfo/);
 const desktop=read('views/agent/detail/components/RecentOrders.vue');
 assert.match(desktop,/title="交易记录"/);
 assert.match(desktop,/<StatusBadge :label="row.business_name"/);
 assert.match(desktop,/v-if="businessDetailRoute\(row\)"/);
 assert.match(read('views/agent/detail/components/RecentOrderCardList.vue'),/actions: businessDetailRoute\(row\) \?/);
 await state.loadRecentTransactions();
 assert.deepEqual(queries[0],{user_id:3,page:2,limit:5});
 assert.equal(state.transactionTotal.value,46);
 await state.setTransactionPage(4);
 assert.equal(route.query.page,'4');
 assert.equal(state.recentTransactions.value[0].order_no,'page-4');
 await state.loadRecentTransactions();
 assert.equal(queries.at(-1).page,4);
 await state.setTransactionLimit(30);
 assert.deepEqual(queries.at(-1),{user_id:3,page:1,limit:30});
 const returned=exports.useAgentOverview();
 assert.equal(returned.transactionLimit.value,30);
 assert.equal(returned.transactionPage.value,1);
 assert.match(desktop,/<TablePager/);
});
