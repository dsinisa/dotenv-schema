'use strict';

function convertToNumber(v) {
  if (!v || v === undefined || v === null)
    return NaN;
  if (typeof v === 'number')
    return v;
  const str = String(v);
  if (str.indexOf('.') >= 0)
    return parseFloat(str);
  if (str.indexOf('0x') === 0)
    return parseInt(str, 16);
  return parseInt(str, 10);
}

function convertToBoolean(v) {
  if (v === undefined || v === null)
    return;
  if (typeof v === 'string') {
    v = v.trim().toLowerCase();
  }
  switch (v) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'yes':
      return true;
    case false:
    case 'false':
    case 0:
    case '0':
    case 'off':
    case 'no':
    case 'none':
      return false;
  }
}

function convertToDate(v)  {
  if (v === undefined || v === null || !v)
    return;
  if (v instanceof Date)
    return v;
  let d = new Date(v);
  return d;
}

function camelCaseToUnderscore(s) {
  return s.replace(/\.?([A-Z]+)/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "")
}

module.exports = {
  convertToNumber,
  convertToBoolean,
  convertToDate,
  camelCaseToUnderscore,
};
