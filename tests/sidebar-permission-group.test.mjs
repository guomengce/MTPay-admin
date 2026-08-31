import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { compileTemplate, parse } from '@vue/compiler-sfc';

test('sidebar groups administrator and future role pages under access management', () => {
  const aside = readFileSync(new URL('../src/layout/components/AppAside.vue', import.meta.url), 'utf8');
  const routes = readFileSync(new URL('../src/router/modules/index.ts', import.meta.url), 'utf8');
  const store = readFileSync(new URL('../src/stores/modules/route.ts', import.meta.url), 'utf8');
  const descriptor = parse(aside, { filename: 'AppAside.vue' }).descriptor;
  assert.deepEqual(compileTemplate({ source: descriptor.template.content, filename: 'AppAside.vue', id: 'sidebar' }).errors, []);
  assert.match(aside, /<el-sub-menu/);
  assert.match(aside, /menu\.children/);
  assert.match(routes, /title: '管理员列表'/);
  assert.match(routes, /menuGroup: \{ path: '\/access-management', title: '权限管理', icon: 'Lock' \}/);
  assert.match(store, /parent\.children\?\.push\(item\)/);
});
