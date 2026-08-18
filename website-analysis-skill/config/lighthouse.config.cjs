'use strict';

/** Standard mobile configuration. Keep in sync with lighthouse-baseline.json. */
module.exports = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 750,
      cpuSlowdownMultiplier: 4,
    },
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    disableStorageReset: false,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  },
};
