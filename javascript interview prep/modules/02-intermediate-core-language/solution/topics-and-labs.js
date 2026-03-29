function bindCallApplyDemo(fn, ctx, ...args) {
  return fn.call(ctx, ...args);
}

function prototypeChainLookup(obj, key) {
  return obj[key];
}

function classCompositionPattern(name) {
  return { name, describe() { return `entity:${name}`; } };
}

function moduleDependencyOrganizer(files) {
  return files.reduce((acc, f) => ((acc[f.module] ||= []).push(f.file), acc), {});
}

function immutableUpdate(state, patch) {
  return { ...state, ...patch };
}

function transformDataPatterns(rows) {
  return rows.map((r) => ({ id: r.id, normalized: String(r.value).trim().toLowerCase() }));
}

function generatorIteratorTopic(limit) {
  function* gen() { for (let i = 0; i < limit; i += 1) yield i; }
  return [...gen()];
}

function symbolsTopic(obj, value) {
  const key = Symbol('k');
  obj[key] = value;
  return Object.getOwnPropertySymbols(obj).length;
}

function weakCollectionsTopic(objects) {
  const ws = new WeakSet();
  objects.forEach((o) => ws.add(o));
  return ws.has(objects[0]);
}

function propertyDescriptorsTopic(obj, key, value) {
  Object.defineProperty(obj, key, { value, writable: false });
  return Object.getOwnPropertyDescriptor(obj, key).writable;
}

function optionalNullishTopic(user) {
  return user?.profile?.city ?? 'unknown';
}

function commonJsVsEsmTopic() {
  return { cjs: 'require/module.exports', esm: 'import/export' };
}

function immutableTransformLibrary(rows) {
  return rows.map((r) => ({ ...r, score: r.score * 2 }));
}

function pluginRegistryLab(plugins) {
  return { run(input) { return plugins.reduce((v, p) => p(v), input); } };
}

function policyEngineLab(rules, input) {
  for (const r of rules) if (!r(input)) return false;
  return true;
}

function nestedConfigMergerLab(base, override) {
  return { ...base, ...override };
}

function customEventEmitterLab() {
  const listeners = new Map();
  return {
    on(evt, cb) { (listeners.get(evt) || listeners.set(evt, []).get(evt)).push(cb); },
    emit(evt, payload) { (listeners.get(evt) || []).forEach((cb) => cb(payload)); },
  };
}

module.exports = {
  bindCallApplyDemo,
  prototypeChainLookup,
  classCompositionPattern,
  moduleDependencyOrganizer,
  immutableUpdate,
  transformDataPatterns,
  generatorIteratorTopic,
  symbolsTopic,
  weakCollectionsTopic,
  propertyDescriptorsTopic,
  optionalNullishTopic,
  commonJsVsEsmTopic,
  immutableTransformLibrary,
  pluginRegistryLab,
  policyEngineLab,
  nestedConfigMergerLab,
  customEventEmitterLab,
};
