export { part2Config } from './config.js';
export * from './data.js';

import { part2Config } from './config.js';
import * as data from './data.js';

const { default: _default, ...namedData } = data;

export const part2Definition = {
  id: part2Config.id,
  config: part2Config,
  ...namedData
};
