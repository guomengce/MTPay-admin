import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';
import ts from 'typescript';
import * as vue from 'vue';

const files = ['exchange/components/ExchangeAddDialog.vue', 'whitelist/components/WhitelistAddDialog.vue', 'withdrawal/components/WithdrawalActionDialog.vue'];
function component(file) {
  const source = readFileSync(new URL('../src/views/' + file, import.meta.url), 'utf8');
  const { descriptor } = parse(source, { filename: file });
  const script = compileScript(descriptor, { id: 'review-test' });
  assert.deepEqual(compileTemplate({ source: descriptor.template.content, filename: file, id: 'review-test', compilerOptions: { bindingMetadata: script.bindings } }).errors, []);
  const output = ts.transpileModule(script.content, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require','module','exports',output)(id => ({ vue, 'element-plus': { ElMessage: { warning() {} } }, '@element-plus/icons-vue': {} })[id], module, module.exports);
  return { source, setup: module.exports.default.setup };
}
test('review dialogs compile and contain no repeated order summary or decorative alert styles', () => {
  for (const file of files) {
    const { source } = component(file);
    assert.doesNotMatch(source, /el-alert|dialogHint|__summary|__detail|__hint|formatMoney/);
    assert.match(source, /确认通过此.+申请？/);
    assert.match(source, /min\(440px/);
  }
});
test('simplified dialogs still emit approval and validate required rejection reasons', async () => {
  for (const file of files) {
    const emitted = [];
    const props = vue.reactive({ modelValue: true, row: { id: 'ORDER' }, mode: 'approve' });
    const state = component(file).setup(props, { expose() {}, emit: (...args) => emitted.push(args) });
    await state.handleSubmit();
    assert.equal(emitted[0][0], 'submit'); assert.equal(emitted[0][1].mode, 'approve');
    props.mode = 'reject';
    state.formRef.value = { validate: async callback => { callback?.(false); return false; } };
    await state.handleSubmit(); assert.equal(emitted.length, 1);
    state.formRef.value = { validate: async callback => { callback?.(true); return true; } };
    if (state.reasonForm) state.reasonForm.reason = '原因';
    else if (state.formState) state.formState.message = '原因';
    else state.form.message = '原因';
    await state.handleSubmit();
    assert.equal(emitted[1][1].mode, 'reject');
    assert.equal(emitted[1][1].reason ?? emitted[1][1].message, '原因');
  }
});
