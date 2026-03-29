const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../solution/topics-and-labs');

test('module-02 topics and labs coverage', () => {
  assert.equal(T.bindCallApplyDemo(function f(x) { return this.v + x; }, { v: 2 }, 3), 5);
  assert.equal(T.prototypeChainLookup(Object.create({ a: 1 }), 'a'), 1);
  assert.equal(T.classCompositionPattern('x').describe(), 'entity:x');
  assert.equal(T.moduleDependencyOrganizer([{ module: 'm', file: 'a.js' }]).m[0], 'a.js');
  assert.equal(T.immutableUpdate({ a: 1 }, { b: 2 }).b, 2);
  assert.equal(T.transformDataPatterns([{ id: 1, value: ' X ' }])[0].normalized, 'x');
  assert.deepEqual(T.generatorIteratorTopic(3), [0, 1, 2]);
  assert.equal(T.symbolsTopic({}, 1), 1);
  assert.equal(T.weakCollectionsTopic([{}]), true);
  assert.equal(T.propertyDescriptorsTopic({}, 'env', 'prod'), false);
  assert.equal(T.optionalNullishTopic({}), 'unknown');
  assert.match(T.commonJsVsEsmTopic().cjs, /require/);
  assert.equal(T.immutableTransformLibrary([{ score: 2 }])[0].score, 4);
  assert.equal(T.pluginRegistryLab([(x) => x + 1]).run(1), 2);
  assert.equal(T.policyEngineLab([(x) => x > 0], 1), true);
  assert.equal(T.nestedConfigMergerLab({ a: 1 }, { b: 2 }).b, 2);
  const e = T.customEventEmitterLab();
  let seen = null;
  e.on('evt', (v) => { seen = v; });
  e.emit('evt', 'ok');
  assert.equal(seen, 'ok');
});
