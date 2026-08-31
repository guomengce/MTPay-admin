import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import * as vue from 'vue';
import * as vr from 'vue-router';

function load(path, imports) {
  const source = readFileSync(new URL('../src/' + path, import.meta.url), 'utf8');
  const module = {exports:{}};
  const code = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  new Function('require','module','exports',code)(id=>imports[id],module,module.exports);
  return module.exports;
}
const node = () => ({children:[],parent:null});
const renderer = vue.createRenderer({
  createElement:node, createText:node, createComment:node,
  setText(){},setElementText(){},patchProp(){},
  parentNode:n=>n.parent,nextSibling:n=>n.parent?.children[n.parent.children.indexOf(n)+1] ?? null,
  insert(n,parent,anchor){n.parent=parent;const index=anchor?parent.children.indexOf(anchor):-1;if(index<0)parent.children.push(n);else parent.children.splice(index,0,n);},
  remove(n){const i=n.parent?.children.indexOf(n);if(i>=0)n.parent.children.splice(i,1);},
});
const settle = async()=>{ for(let i=0;i<5;i++){await new Promise(resolve=>setTimeout(resolve,0));await vue.nextTick();} };

test('exchange filters and API parameters survive actual router detail/back remount', async()=>{
  const requests=[];
  const stateHelper=load('composables/useListQueryState.ts',{'vue-router':vr});
  const {useExchangeList}=load('views/exchange/composables/useExchangeList.ts',{
    vue,'@/composables/useListQueryState':stateHelper,
    '@/api/modules/exchange':{fetchExchangeList:async params=>{requests.push({...params});return{data:[],total:80};}},
    './mapper':{toExchangeRow:x=>x},
  });
  let state;
  const List={setup(){state=useExchangeList();return()=>vue.h('div');}};
  const router=vr.createRouter({history:vr.createMemoryHistory(),routes:[{path:'/exchange',component:List},{path:'/exchange/detail/:id',component:{render:()=>vue.h('div')}}]});
  const app=renderer.createApp({render:()=>vue.h(vr.RouterView,null,{default:({Component,route})=>Component?vue.h(Component,{key:route.path}):null})});
  app.use(router);
  await router.push('/exchange');await router.isReady();app.mount(node());await settle();
  Object.assign(state.query,{keyword:'sample',status:0,started_at:'2026-08-01',ended_at:'2026-08-28'});
  state.search();await settle();state.page.value=3;await settle();
  const expected={...requests.at(-1)};
  assert.equal(state.exportFilters.value.status,0);
  state.query.status=2;
  assert.equal(state.exportFilters.value.status,0, 'unapplied edits must not change export filters');
  state.query.status=0;
  assert.equal(router.currentRoute.value.query.status,'0');
  await router.push('/exchange/detail/12');await settle();router.go(-1);await settle();
  assert.deepEqual(requests.at(-1),expected);
  assert.equal(state.query.keyword,'sample');assert.equal(state.query.status,0);assert.equal(state.page.value,3);
  assert.equal(state.exportFilters.value.keyword,'sample');assert.equal(state.exportFilters.value.status,0);
  // Some return links navigate to a bare list URL instead of browser history.
  await router.push('/exchange/detail/12');await settle();
  await router.push('/exchange');await settle();
  assert.deepEqual(requests.at(-1),expected);
  assert.equal(state.query.keyword,'sample');assert.equal(state.page.value,3);
  assert.equal(router.currentRoute.value.query.status,'0');
  state.reset();await settle();
  await router.push('/exchange/detail/12');await settle();await router.push('/exchange');await settle();
  assert.equal(state.query.keyword,'');assert.equal(state.query.status,undefined);assert.equal(state.page.value,1);
  // Explicit URL filters take precedence over the cached search.
  await router.push('/exchange/detail/12');await settle();await router.push('/exchange?status=2');await settle();
  assert.equal(state.query.status,2);assert.equal(state.query.keyword,'');
  await router.push('/exchange/detail/12');await settle();
  stateHelper.clearListQueryState();
  await router.push('/exchange');await settle();assert.equal(state.query.status,undefined);
  app.unmount();
});
