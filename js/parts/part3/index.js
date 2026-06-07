export { part3Config } from './config.js';
export * from './data.js';

import { part3Config } from './config.js';
import * as data from './data.js';

const { default: _default, ...namedData } = data;

export const part3Definition = {
  id: part3Config.id,
  config: part3Config,
  ...namedData
};
