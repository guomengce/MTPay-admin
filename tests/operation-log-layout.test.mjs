import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { compileTemplate, parse } from '@vue/compiler-sfc';

test('operation logs use separated record cards instead of a timeline', () => {
  const url = new URL('../src/views/log/index.vue', import.meta.url);
  const source = readFileSync(url, 'utf8');
  const descriptor = parse(source, { filename: 'LogIndex.vue' }).descriptor;
  assert.deepEqual(compileTemplate({ source: descriptor.template.content, filename: 'LogIndex.vue', id: 'operation-log' }).errors, []);
  assert.match(source, /class="log-list__items"/);
  assert.match(source, /class="log-record"/);
  assert.match(source, /border: 1px solid #dfe8f1/);
  assert.doesNotMatch(source, /el-timeline|log-timeline/);
});
