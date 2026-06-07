import { part1Definition } from './part1/index.js';
import { part2Definition } from './part2/index.js';
import { part3Definition } from './part3/index.js';
import { part4Definition } from './part4/index.js';

const parts = {
  '1': part1Definition,
  '2': part2Definition,
  '3': part3Definition,
  '4': part4Definition
};

export function getPartDefinition(partId) {
  return parts[String(partId)] || null;
}
