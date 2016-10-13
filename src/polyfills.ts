import 'es6-shim';
import 'reflect-metadata';
require('zone.js/dist/zone');
if (process.env.ENV === 'production') {
  // Production
} else {
  // Development
  const stackTraceLimit = 'stackTraceLimit';
  Error[stackTraceLimit] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
