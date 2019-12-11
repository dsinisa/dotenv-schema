'use strict';
const { convertToNumber, convertToBoolean, convertToDate, camelCaseToUnderscore } = require('./convert');

function parseString(val, defVal, options) {
  if (options) {

  }
  return val || defVal || '';
}

function parseNumber(val, defVal, options) {
  if (options) {

  }
  let v = convertToNumber(val);
  if (isNaN(v))
    v = convertToNumber(defVal);
  return v || 0;
}

function parseBoolean(val, defVal, options) {
  if (options) {

  }
  let v = convertToBoolean(val);
  if (v === undefined)
    v = convertToBoolean(defVal);
  return v || false;
}

function parseDate(val, defVal, options) {
  if (options) {

  }
  let v = convertToDate(val);
  if (v === undefined)
    v = convertToDate(defVal);
  return v;
}

function checkRequired(varName, val, options, dumpEnv) {
  if (dumpEnv) return;
  if (options.required && (val === undefined || val === null)) {
    throw new Error(`required variable not set '${varName}'`);
  }
}

function getValueType(obj) {
  let val = obj ? obj.type || obj.value || obj.default || obj : undefined;
  if (!val) {
    if (obj === false)
      val =false;
    else if (obj) {
      if (obj.type === false || obj.value === false || obj.default === false)
        val = false;
    }
  }
  let t;
  if (val === undefined || val === null || typeof val === 'string' || val === String)
    t = 'string';
  else if (val === Number || typeof val === 'number')
    t = 'number';
  else if (val === Boolean || typeof val === 'boolean')
    t = 'boolean';
  else if (val === Date || (typeof val === 'object' && val instanceof Date))
    t = 'date';
  else
    t = typeof val;

  return t;
}

function getValue(obj, options) {
  let v = obj.value || obj.default || obj;
  if (v && isSchemaLeaf(v))
    v = undefined;
  if (v && typeof v === 'function') {
    v = v();
  }
  if (v === undefined && options) {
    v = getValue(options);
  }
  return v;
}

function getVarName(name, options) {
  if (options && options.envName) {
    return options.envName;
  }
  if (!(options && options.noCamelCase)) {
    name = camelCaseToUnderscore(name);
  }
  if (!(options && options.noUpperCase)) {
    name = name.toString().toUpperCase();
  }
  return name;
}

function getEnv(name, obj, defaultOptions, dumpEnv) {
  const options = Object.assign({}, defaultOptions, obj);
  const varName = getVarName(name, options);
  const envValue = process.env[varName];
  const objValue = getValue(obj, options);
  const valueType = getValueType(objValue);

  checkRequired(varName, envValue, options, dumpEnv);

  let result;
  if (valueType === 'string') {
    result = parseString(envValue, objValue, options);
  } else if (valueType === 'number') {
    result = parseNumber(envValue, objValue, options);
  } else if (valueType === 'boolean') {
    result = parseBoolean(envValue, objValue, options);
  } else if (valueType === 'date') {
    result =  parseDate(envValue, objValue, options);
  } else {
    throw new Error(`unknown type for ${varName} = ${objValue} (${typeof objValue})`);
  }

  if (options.values &&
    options.values.length &&
    options.values.indexOf &&
    options.values.indexOf(result) === -1) {
    throw new Error(`invalid value for ${varName} = ${result} valuesLength=${options.values.length}`);
  }

  if (dumpEnv) {
    dumpEnv.push(`${varName}=${result}`);
  }
  return result;
}

function isSchemaLeaf(value) {
  if (!value || typeof value !== 'object')
    return false;
  return !!(value['type'] ||
    value['default'] ||
    value['value'] ||
    value['required'] ||
    value['values'] ||
    value['envName'] ||
    value['noCamelCase'] ||
    value['noUpperCase']
  );
}

function isLeaf(value) {
  return !(value &&
    typeof value === 'object' &&
    !isSchemaLeaf(value)
  );
}

function addSection(prefix, value, defaultOptions, dumpEnv) {
  if (isLeaf(value)) {
    return getEnv(prefix, value, defaultOptions, dumpEnv);
  }
  const result = {};
  Object.keys(value).forEach(key => {
    result[key] = addSection(`${prefix}_${key}`, value[key], defaultOptions, dumpEnv);
});
  return result;
}

function config(configSchema, defaultOptions, dumpEnvOption) {
  const result = {};
  let dumpEnv;
  if (dumpEnvOption)
    dumpEnv = [];
  Object.keys(configSchema).forEach(key => {
    result[key] = addSection(key, configSchema[key], defaultOptions, dumpEnv);
});
  if (dumpEnvOption)
    return dumpEnv.join('\n');
  return result;
}

function dumpConfig(configSchema, defaultOptions) {
  return config(configSchema, defaultOptions, true);
}

module.exports = {
  config,
  dumpConfig,
};
