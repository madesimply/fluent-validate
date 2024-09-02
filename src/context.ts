import { Context } from './types';

export function get(target: 'value' | 'valid' | 'errors', data: any, defaultValue?: any) {
  data[target] = data[target] || defaultValue;
  return data[target];
}

export function set(target: 'value' | 'valid' | 'errors', data: any, value: any) {
  data[target] = value;
  return data;
}

export const ctx: Context = {
  validate: { 
    set,
    get,
  }
};