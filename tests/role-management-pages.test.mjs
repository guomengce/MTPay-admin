import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { compileTemplate, parse } from '@vue/compiler-sfc';

const root = new URL('../src/views/role/', import.meta.url);
test('role management provides list cards table and shared create-edit page', () => {
  const files = ['index.vue','components/RoleFilters.vue','components/RoleTableList.vue','components/RoleCardList.vue','form/index.vue','form/components/RoleBasicForm.vue','form/components/PermissionMatrix.vue'];
  for (const file of files) {
    const url = new URL(file, root);
    assert.equal(existsSync(url), true, `${file} should exist`);
    if (!file.endsWith('.vue')) continue;
    const source = readFileSync(url, 'utf8');
    const descriptor = parse(source, { filename: file }).descriptor;
    assert.deepEqual(compileTemplate({ source: descriptor.template.content, filename: file, id: 'role-management' }).errors, [], `${file} template should compile`);
  }
  const list = readFileSync(new URL('index.vue', root), 'utf8');
  const form = readFileSync(new URL('form/index.vue', root), 'utf8');
  const routes = readFileSync(new URL('../src/router/modules/index.ts', import.meta.url), 'utf8');
  assert.match(list, /RoleTableList/);
  assert.match(list, /RoleCardList/);
  assert.match(list, /ElMessageBox\.confirm/);
  assert.match(form, /isEdit\?'编辑角色':'新增角色'/);
  assert.match(form, /PermissionMatrix/);
  assert.doesNotMatch(form, /<p>|description/);
  assert.doesNotMatch(list, /subtitle=/);
  const basic = readFileSync(new URL('form/components/RoleBasicForm.vue', root), 'utf8');
  const permissions = readFileSync(new URL('form/components/PermissionMatrix.vue', root), 'utf8');
  assert.match(basic, /grid-template-columns:minmax\(0,1fr\) minmax\(220px,\.45fr\)/);
  assert.doesNotMatch(basic, /角色描述|textarea/);
  assert.match(permissions, /min-height:520px/);
  assert.match(routes, /name: 'RoleCreate'/);
  assert.match(routes, /name: 'RoleEdit'/);
  assert.doesNotMatch(form, /el-dialog/);
});
