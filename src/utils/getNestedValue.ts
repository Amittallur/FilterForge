import { get } from 'lodash';

/**
 * Resolves a value from an object using dot-notation.
 * Wraps lodash _.get to centralise the dependency.
 * Accepts any object (not just Record<string, unknown>) so typed
 * interfaces like Employee can be passed without a cast.
 *
 * @example getNestedValue({ address: { city: 'NYC' } }, 'address.city') // 'NYC'
 */
export function getNestedValue(obj: object, path: string): unknown {
  return get(obj, path);
}
