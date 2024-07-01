/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { sampleRUM } from '@adobe/helix-rum-js';

/**
 * Setup block utils.
 */
export function setup() {
  window.hlx = window.hlx || {};
  window.hlx.RUM_MASK_URL = 'full';
  window.hlx.codeBasePath = '';
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';

  const scriptEl = document.querySelector('script[src$="/scripts/scripts.js"]');
  if (scriptEl) {
    try {
      [window.hlx.codeBasePath] = new URL(scriptEl.src).pathname.split('/scripts/scripts.js');
      /* c8 ignore next 4 */
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}

/**
 * Auto initializiation.
 */
/* c8 ignore next 14 */
export function init() {
  setup();
  sampleRUM('top');

  window.addEventListener('load', () => sampleRUM('load'));

  ['error', 'unhandledrejection'].forEach((event) => {
    window.addEventListener(event, ({ reason, error }) => {
      const errData = { source: 'undefined error' };
      try {
        errData.target = (reason || error).toString();
        errData.source = (reason || error).stack.split('\n')
          .filter((line) => line.match(/https?:\/\//)).shift()
          .replace(/at ([^ ]+) \((.+)\)/, '$1@$2')
          .trim();
      } catch (err) { /* error structure was not as expected */ }
      sampleRUM('error', errData);
    });
  });
}
