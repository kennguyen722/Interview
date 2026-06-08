// bindCallApplyDemo: Demonstrates using Function.prototype.call to invoke a function with a specific context and arguments.
function bindCallApplyDemo(fn, ctx, ...args) {
  return fn.call(ctx, ...args);
}

// prototypeChainLookup: Looks up a property by key, traversing the prototype chain if necessary.
function prototypeChainLookup(obj, key) {
  return obj[key];
}

// classCompositionPattern: Returns an object with a name and a describe method, demonstrating composition.
function classCompositionPattern(name) {
  return { name, describe() { return `entity:${name}`; } };
}

// moduleDependencyOrganizer: Organizes files by module name into an object of arrays.
function moduleDependencyOrganizer(files) {
  return files.reduce((acc, f) => ((acc[f.module] ||= []).push(f.file), acc), {});
}

// immutableUpdate: Returns a new object with properties from patch merged into state (immutably).
function immutableUpdate(state, patch) {
  return { ...state, ...patch };
}

// transformDataPatterns: Normalizes the value property of each row (trims and lowercases).
function transformDataPatterns(rows) {
  return rows.map((r) => ({ id: r.id, normalized: String(r.value).trim().toLowerCase() }));
}

// generatorIteratorTopic: Demonstrates a generator that yields numbers up to a limit, returning as an array.
function generatorIteratorTopic(limit) {
  function* gen() { for (let i = 0; i < limit; i += 1) yield i; }
  return [...gen()];
}

// symbolsTopic: Attaches a value to an object using a Symbol key, returns the number of symbol properties.
function symbolsTopic(obj, value) {
  const key = Symbol('k');
  obj[key] = value;
  return Object.getOwnPropertySymbols(obj).length;
}

// weakCollectionsTopic: Adds objects to a WeakSet and checks if the first object is present.
function weakCollectionsTopic(objects) {
  const ws = new WeakSet();
  objects.forEach((o) => ws.add(o));
  return ws.has(objects[0]);
}

// propertyDescriptorsTopic: Defines a non-writable property and returns its writability status.
function propertyDescriptorsTopic(obj, key, value) {
  Object.defineProperty(obj, key, { value, writable: false });
  return Object.getOwnPropertyDescriptor(obj, key).writable;
}

// optionalNullishTopic: Safely retrieves the city from a nested user object, returns 'unknown' if missing.
function optionalNullishTopic(user) {
  return user?.profile?.city ?? 'unknown';
}

// commonJsVsEsmTopic: Returns a summary of CommonJS vs ESM module syntax.
function commonJsVsEsmTopic() {
  return { cjs: 'require/module.exports', esm: 'import/export' };
}

// immutableTransformLibrary: Returns a new array with each row's score property doubled.
function immutableTransformLibrary(rows) {
  return rows.map((r) => ({ ...r, score: r.score * 2 }));
}

// pluginRegistryLab: Returns an object with a run method that applies all plugins to the input in sequence.
function pluginRegistryLab(plugins) {
  return { run(input) { return plugins.reduce((v, p) => p(v), input); } };
}

// policyEngineLab: Returns true if all rule functions return true for the input, otherwise false.
function policyEngineLab(rules, input) {
  for (const r of rules) if (!r(input)) return false;
  return true;
}

// nestedConfigMergerLab: Merges two config objects, with override taking precedence.
function nestedConfigMergerLab(base, override) {
  return { ...base, ...override };
}

// customEventEmitterLab: Returns a simple event emitter with on and emit methods.
// Allows registering listeners and emitting events with payloads.
function customEventEmitterLab() {
  const listeners = new Map();
  return {
    // Register a callback for an event
    on(evt, cb) { (listeners.get(evt) || listeners.set(evt, []).get(evt)).push(cb); },
    // Emit an event, calling all registered callbacks
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
